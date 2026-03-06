const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const OpenAI = require('openai');

admin.initializeApp();
const db = admin.firestore();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- 1. Project Invites ---

/**
 * Sends a project invite email and creates an invite document.
 * @param {string} email - The email to invite.
 * @param {string} projectId - The project ID.
 * @param {string} role - The role (admin, member, viewer).
 */
exports.sendProjectInviteEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
  const { email, projectId, role } = data;

  const inviteRef = db.collection('projectInvites').doc();
  const inviteId = inviteRef.id;

  await inviteRef.set({
    email,
    projectId,
    role,
    inviterId: context.auth.uid,
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const inviteLink = `https://pathfinder-app.com/projects/${projectId}?invite=${inviteId}`;

  const msg = {
    to: email,
    from: 'noreply@pathfinder-app.com',
    subject: 'You have been invited to join a project on Pathfinder',
    text: `Click here to join: ${inviteLink}`,
    html: `<p>Click here to join: <a href="${inviteLink}">${inviteLink}</a></p>`,
  };

  try {
    await sgMail.send(msg);
    return { success: true, inviteId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email.');
  }
});

/**
 * Accepts a project invite.
 * @param {string} inviteId - The invite ID.
 */
exports.acceptProjectInvite = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
  const { inviteId } = data;

  const inviteRef = db.collection('projectInvites').doc(inviteId);
  const inviteSnap = await inviteRef.get();

  if (!inviteSnap.exists) throw new functions.https.HttpsError('not-found', 'Invite not found.');
  const inviteData = inviteSnap.data();

  if (inviteData.status !== 'pending') throw new functions.https.HttpsError('failed-precondition', 'Invite already used.');
  
  // Verify email matches logged-in user (optional, but good for security)
  const userRecord = await admin.auth().getUser(context.auth.uid);
  if (userRecord.email !== inviteData.email) {
      // In strict mode, throw error. For MVP, maybe allow if link possession implies ownership?
      // Let's enforce email match for security as requested.
      if (userRecord.email !== inviteData.email) {
          throw new functions.https.HttpsError('permission-denied', 'Email does not match invite.');
      }
  }

  // Add member to project
  await db.collection('projects').doc(inviteData.projectId).collection('members').doc(context.auth.uid).set({
    role: inviteData.role,
    joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    email: userRecord.email,
    displayName: userRecord.displayName || 'Member',
    photoURL: userRecord.photoURL || '',
  });

  // Mark invite as accepted
  await inviteRef.update({ status: 'accepted', acceptedBy: context.auth.uid, acceptedAt: admin.firestore.FieldValue.serverTimestamp() });

  return { success: true, projectId: inviteData.projectId };
});

// --- 2. Mock Interviews ---

/**
 * Sends an interview invite email.
 * @param {string} interviewId - The interview ID.
 * @param {string} toEmail - The recipient email.
 */
exports.sendInterviewInviteEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
  const { interviewId, toEmail } = data;

  const link = `https://pathfinder-app.com/mock-interviews?interview=${interviewId}`;

  const msg = {
    to: toEmail,
    from: 'noreply@pathfinder-app.com',
    subject: 'Mock Interview Invitation',
    text: `You have been invited to a mock interview. Join here: ${link}`,
    html: `<p>You have been invited to a mock interview. <a href="${link}">Join here</a></p>`,
  };

  await sgMail.send(msg);
  return { success: true };
});

/**
 * Analyzes interview feedback using OpenAI and generates a practice plan.
 * Trigger: onCreate of feedback document.
 */
exports.analyzeInterviewFeedback = functions.firestore
  .document('mockInterviews/{interviewId}/feedback/{feedbackId}')
  .onCreate(async (snap, context) => {
    const feedback = snap.data();
    const interviewId = context.params.interviewId;

    // Construct prompt for OpenAI
    const prompt = `
      Analyze the following interview feedback and generate a structured practice plan JSON.
      Feedback: "${feedback.notes}"
      Scores: ${JSON.stringify(feedback.scores)}
      
      Output JSON format:
      {
        "tasks": [
          { "title": "Task Title", "description": "Details...", "duration_minutes": 30 }
        ]
      }
    `;

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful career coach." }, { role: "user", content: prompt }],
        model: "gpt-4",
      });

      const planJson = JSON.parse(completion.choices[0].message.content);

      // Write to Firestore
      await db.collection('mockInterviews').doc(interviewId).collection('aiPracticePlan').doc('latest').set({
        ...planJson,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        generatedFromFeedbackId: context.params.feedbackId,
      });
    } catch (error) {
      console.error('Error analyzing feedback:', error);
    }
  });

// --- 3. Counters & Aggregations ---

/**
 * Updates post like counts.
 */
exports.onPostLikeWrite = functions.firestore
  .document('posts/{postId}/likes/{userId}')
  .onWrite(async (change, context) => {
    const postId = context.params.postId;
    const postRef = db.collection('posts').doc(postId);

    let increment = 0;
    if (!change.before.exists && change.after.exists) {
      increment = 1; // Created
    } else if (change.before.exists && !change.after.exists) {
      increment = -1; // Deleted
    }

    if (increment !== 0) {
      await postRef.update({
        'counts.likes': admin.firestore.FieldValue.increment(increment)
      });
    }
  });

/**
 * Updates post comment counts.
 */
exports.onPostCommentWrite = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onWrite(async (change, context) => {
    const postId = context.params.postId;
    const postRef = db.collection('posts').doc(postId);

    let increment = 0;
    if (!change.before.exists && change.after.exists) {
      increment = 1;
    } else if (change.before.exists && !change.after.exists) {
      increment = -1;
    }

    if (increment !== 0) {
      await postRef.update({
        'counts.comments': admin.firestore.FieldValue.increment(increment)
      });
    }
  });
