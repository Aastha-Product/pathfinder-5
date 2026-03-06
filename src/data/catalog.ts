import { CatalogData } from '../../types';

export const CATALOG: CatalogData = {
  "courses": [
    {
      "slug": "data-analytics",
      "title": "Data Analytics",
      "shortDesc": "Excel + SQL + Python + Dashboards + basic statistics for job-ready analytics.",
      "tags": ["Excel", "SQL", "Python", "Tableau"],
      "modules": [
        {
          "order": 1,
          "title": "Problem Framing + Analytics Process",
          "estimatedMinutes": 40,
          "subtopics": ["CRISP-DM workflow", "Define metrics", "Stakeholder questions"],
          "outcome": "Turn vague requests into measurable analytics tasks.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "CRISP-DM overview", "url": "https://www.datascience-pm.com/crisp-dm-2/" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "Excel / Spreadsheets for Analysis",
          "estimatedMinutes": 60,
          "subtopics": ["Cleaning basics", "PivotTables", "Charts for reporting"],
          "outcome": "Summarize and report insights fast using spreadsheets.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "PivotTable guide", "url": "https://support.microsoft.com/en-us/office/create-a-pivottable-to-analyze-worksheet-data-a9a84538-bfe9-40a9-a8e9-f99134456576" }
          ],
          "tests": [
            { "type": "test", "label": "Excel skills test", "url": "https://corporatefinanceinstitute.com/resources/excel/excel-test/" }
          ]
        },
        {
          "order": 3,
          "title": "SQL for Analytics",
          "estimatedMinutes": 90,
          "subtopics": ["Joins", "Aggregations", "CTEs", "Window functions"],
          "outcome": "Answer business questions from relational datasets using advanced SQL.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "SQLBolt interactive SQL", "url": "https://sqlbolt.com/" }
          ],
          "tests": [
            { "type": "test", "label": "SQL quiz", "url": "https://www.w3schools.com/sql/sql_quiz.asp" }
          ]
        },
        {
          "order": 4,
          "title": "Python Foundations",
          "estimatedMinutes": 90,
          "subtopics": ["Control flow", "Functions", "Data structures", "Basic OOP"],
          "outcome": "Write basic scripts and manipulate datasets in Python.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python official tutorial", "url": "https://docs.python.org/3/tutorial/" }
          ],
          "tests": [
            { "type": "test", "label": "Python quiz", "url": "https://www.w3schools.com/python/python_quiz.asp" }
          ]
        },
        {
          "order": 5,
          "title": "Python Libraries for Analytics",
          "estimatedMinutes": 120,
          "subtopics": ["pandas basics", "Cleaning", "EDA", "Simple plots"],
          "outcome": "Clean, transform, and explore data with pandas.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "pandas user guide", "url": "https://pandas.pydata.org/docs/user_guide/index.html" }
          ],
          "tests": [
            { "type": "test", "label": "pandas quiz", "url": "https://www.w3schools.com/python/pandas/pandas_quiz.asp" }
          ]
        },
        {
          "order": 6,
          "title": "Statistics + Hypothesis Testing",
          "estimatedMinutes": 120,
          "subtopics": ["Distributions", "Confidence intervals", "t-test / chi-square / ANOVA"],
          "outcome": "Pick the right statistical test and interpret results correctly.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Intro to Modern Statistics (free textbook)", "url": "https://openintro-ims.netlify.app/" },
            { "type": "read", "label": "Hypothesis testing overview", "url": "https://www.tutorialspoint.com/statistics/hypothesis_testing.htm" }
          ],
          "tests": [
            { "type": "test", "label": "Hypothesis testing MCQ quiz", "url": "https://www.gkseries.com/mcq-on-hypothesis-testing/multiple-choice-questions-and-answers-on-hypothesis-testing.php" }
          ]
        },
        {
          "order": 7,
          "title": "Dashboards + Storytelling",
          "estimatedMinutes": 120,
          "subtopics": ["Power BI basics", "Dashboards", "Presenting insights"],
          "outcome": "Build and explain dashboards for stakeholders.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Microsoft Learn Power BI path", "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi" }
          ],
          "tests": [
            { "type": "test", "label": "Power BI dashboard module", "url": "https://learn.microsoft.com/en-us/training/modules/create-dashboards-power-bi/" }
          ]
        },
        {
          "order": 8,
          "title": "Capstone Case Study",
          "estimatedMinutes": 180,
          "subtopics": ["End-to-end analysis", "Portfolio writeup", "Presentation"],
          "outcome": "Ship a portfolio-grade case study.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Capstone expectations reference", "url": "https://www.coursera.org/professional-certificates/google-data-analytics" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "Retail Superstore Sales Dashboard",
          "problem": "Analyze sales/profit trends and recommend actions.",
          "tools": ["Excel", "Power BI or Tableau", "SQL (optional)"],
          "deliverables": ["Dashboard", "5 insights", "3 recommendations", "PDF export"]
        },
        {
          "title": "RSVP / Movie SQL Case Study",
          "problem": "Answer business questions using joins/window functions.",
          "tools": ["SQL"],
          "deliverables": ["SQL script", "Results summary", "Optimization notes"]
        },
        {
          "title": "Credit Risk Analysis",
          "problem": "Find drivers of default risk and build a baseline model.",
          "tools": ["Python", "pandas"],
          "deliverables": ["EDA notebook", "Baseline model", "Decision memo"]
        }
      ],
      "mockInterviewChecklist": [
          "Technical: SQL queries (joins, window functions).",
          "Scenario: How would you investigate a drop in metrics?",
          "Visualization: Critique a dashboard or chart.",
          "Behavioral: Tell me about a time you had to explain data to a non-technical stakeholder."
      ]
    },
    {
      "slug": "data-science",
      "title": "Data Science",
      "shortDesc": "Math + Python + SQL + ML + optional deep learning + deployment basics.",
      "tags": ["Python", "Machine Learning", "Statistics", "SQL"],
      "modules": [
        {
          "order": 1,
          "title": "Math Foundations (Linear Algebra)",
          "estimatedMinutes": 120,
          "subtopics": ["Vectors", "Matrices", "Linear transformations", "Eigenvalues"],
          "outcome": "Understand core math behind ML models.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "3Blue1Brown linear algebra", "url": "https://www.3blue1brown.com/topics/linear-algebra" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "SQL for Data Science",
          "estimatedMinutes": 120,
          "subtopics": ["Joins", "Aggregations", "CTEs", "Window functions"],
          "outcome": "Query and analyze data in relational systems.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "SQLBolt interactive SQL", "url": "https://sqlbolt.com/" }
          ],
          "tests": [
            { "type": "test", "label": "SQL quiz", "url": "https://www.w3schools.com/sql/sql_quiz.asp" }
          ]
        },
        {
          "order": 3,
          "title": "Python Foundations",
          "estimatedMinutes": 120,
          "subtopics": ["Control flow", "Data structures", "Functions", "Basic OOP"],
          "outcome": "Build reusable Python code for data workflows.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python official tutorial", "url": "https://docs.python.org/3/tutorial/" }
          ],
          "tests": [
            { "type": "test", "label": "Python quiz", "url": "https://www.w3schools.com/python/python_quiz.asp" }
          ]
        },
        {
          "order": 4,
          "title": "Data Cleaning + pandas",
          "estimatedMinutes": 180,
          "subtopics": ["Missing data", "Duplicates", "Transformations"],
          "outcome": "Prepare datasets for modeling.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "pandas missing data guide", "url": "https://pandas.pydata.org/docs/user_guide/missing_data.html" }
          ],
          "tests": [
            { "type": "test", "label": "pandas quiz", "url": "https://www.w3schools.com/python/pandas/pandas_quiz.asp" }
          ]
        },
        {
          "order": 5,
          "title": "Core Machine Learning",
          "estimatedMinutes": 240,
          "subtopics": ["Regression", "Classification", "Overfitting", "Metrics"],
          "outcome": "Train baseline ML models and evaluate them properly.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Google ML Crash Course", "url": "https://developers.google.com/machine-learning/crash-course" }
          ],
          "tests": [
            { "type": "test", "label": "MLCC exercises", "url": "https://developers.google.com/machine-learning/crash-course/exercises" }
          ]
        },
        {
          "order": 6,
          "title": "Model Evaluation + Cross Validation",
          "estimatedMinutes": 120,
          "subtopics": ["Cross-validation", "Grid search", "Scoring"],
          "outcome": "Avoid common interview mistakes in evaluation and leakage.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "scikit-learn cross-validation guide", "url": "https://scikit-learn.org/stable/modules/cross_validation.html" }
          ],
          "tests": [
            { "type": "test", "label": "scikit-learn MOOC quiz", "url": "https://inria.github.io/scikit-learn-mooc/predictive_modeling_pipeline/02_numerical_pipeline_quiz_m1_02.html" }
          ]
        },
        {
          "order": 7,
          "title": "Big Data Basics (Spark)",
          "estimatedMinutes": 120,
          "subtopics": ["Spark shell", "DataFrames", "Transformations"],
          "outcome": "Understand distributed data processing basics.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Spark quick start", "url": "https://spark.apache.org/docs/latest/quick-start.html" }
          ],
          "tests": []
        },
        {
          "order": 8,
          "title": "Deployment Basics (FastAPI + Docker)",
          "estimatedMinutes": 180,
          "subtopics": ["API endpoint", "Containerize model service"],
          "outcome": "Ship a minimal model API and run it reproducibly.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "FastAPI first steps", "url": "https://fastapi.tiangolo.com/tutorial/first-steps/" },
            { "type": "learn", "label": "Docker get started", "url": "https://docs.docker.com/get-started/" }
          ],
          "tests": []
        },
        {
          "order": 9,
          "title": "NLP / LLM Basics (Optional)",
          "estimatedMinutes": 180,
          "subtopics": ["Transformers basics", "Tokens", "Fine-tuning concepts"],
          "outcome": "Understand how LLM/NLP pipelines work.",
          "isOptional": true,
          "resources": [
            { "type": "learn", "label": "Hugging Face LLM course", "url": "https://huggingface.co/learn/llm-course/en/chapter1/1" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "House Price Prediction",
          "problem": "Predict prices and explain drivers with a regression baseline.",
          "tools": ["Python", "pandas", "scikit-learn"],
          "deliverables": ["EDA notebook", "Model + metrics", "Insights report"]
        },
        {
          "title": "Loan Uptake Probability Modeling",
          "problem": "Predict which users will take personal loans and propose targeting rules.",
          "tools": ["Python", "scikit-learn"],
          "deliverables": ["Model pipeline", "Threshold decision", "Business memo"]
        },
        {
          "title": "End-to-End ML API",
          "problem": "Deploy one of your models as an API and containerize it.",
          "tools": ["FastAPI", "Docker"],
          "deliverables": ["Running API", "Dockerfile", "README + sample calls"]
        }
      ],
      "mockInterviewChecklist": [
          "Technical: Explain bias vs variance.",
          "Coding: Implement a basic ML algorithm (e.g. k-means) or data manipulation.",
          "Scenario: How do you handle missing data?",
          "Behavioral: Describe a challenging modeling problem you solved."
      ]
    },
    {
      "slug": "machine-learning-engineer",
      "title": "Machine Learning Engineer",
      "shortDesc": "End-to-end ML engineering: algorithms, tuning, deep learning basics, GenAI intro, and MLOps deployment.",
      "tags": ["ML", "scikit-learn", "MLOps", "Deployment"],
      "isMvpCardOnly": true
    },
    {
      "slug": "artificial-intelligence",
      "title": "Artificial Intelligence",
      "shortDesc": "Deep learning + modern GenAI: transformers, prompt patterns, and applied AI design with ethics.",
      "tags": ["Deep Learning", "Transformers", "GenAI", "Applied AI"],
      "isMvpCardOnly": true
    },
    {
      "slug": "full-stack-developer",
      "title": "Full Stack Developer",
      "shortDesc": "Frontend + backend + databases + auth + testing + deployment for job-ready full stack roles.",
      "tags": ["HTML/CSS", "JavaScript", "React", "Node", "Databases", "Auth", "Deploy"],
      "isMvpCardOnly": true
    },
    {
      "slug": "python-developer",
      "title": "Python Developer",
      "shortDesc": "Python programming + APIs + databases + testing + deployment for backend job readiness.",
      "tags": ["Python", "APIs", "SQL", "Testing", "Deployment"],
      "isMvpCardOnly": true
    },
    {
      "slug": "cloud-computing",
      "title": "Cloud Computing",
      "shortDesc": "Master AWS, Azure, GCP, DevOps, and Containers for cloud architect roles.",
      "tags": ["AWS", "Azure", "GCP", "DevOps", "Docker", "Kubernetes"],
      "isMvpCardOnly": true
    },
    {
      "slug": "cybersecurity",
      "title": "Cybersecurity",
      "shortDesc": "Comprehensive Cyber defense: Network security, SOC, GRC, and Ethical Hacking.",
      "tags": ["Network Security", "SOC", "Ethical Hacking", "GRC"],
      "isMvpCardOnly": true
    },
    {
      "slug": "business-analytics",
      "title": "Business Analyst",
      "shortDesc": "BA role, requirements, process modeling, SQL, and Agile practices.",
      "tags": ["SQL", "Excel", "Process Modeling", "Requirements"],
      "isMvpCardOnly": true
    },
    {
      "slug": "product-management",
      "title": "Product Management",
      "shortDesc": "PM fundamentals, execution, metrics, and interviews.",
      "tags": ["Roadmaps", "Metrics", "Strategy", "Leadership"],
      "isMvpCardOnly": true
    }
  ]
};
