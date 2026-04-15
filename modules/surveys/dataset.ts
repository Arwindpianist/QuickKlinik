export type SurveyQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "number_rating"
  | "matrix_rating"
  | "text";

export type SurveyCondition = {
  all: Array<{
    questionId: string;
    equals: string;
  }>;
};

export type SurveyQuestion = {
  id: string;
  type: SurveyQuestionType;
  question: string;
  options?: string[];
  maxSelections?: number;
  items?: string[];
  min?: number;
  max?: number;
  condition?: SurveyCondition;
};

export type SurveySection = {
  id: string;
  title: string;
  questions: SurveyQuestion[];
};

export const QUICKKLINIK_SURVEY_DATASET: SurveySection[] = [
  {
    id: "section_0",
    title: "Identification & Screening",
    questions: [
      {
        id: "role",
        type: "single_choice",
        question: "Which best describes you?",
        options: [
          "Clinic Owner / Manager",
          "Doctor",
          "Nurse / Clinic Staff",
          "Patient / Customer",
          "General Public",
        ],
      },
      {
        id: "clinic_affiliation",
        type: "single_choice",
        question: "Are you currently working in or operating a clinic or hospital?",
        options: ["Yes", "No"],
      },
      {
        id: "clinic_size",
        type: "single_choice",
        question: "What is the size of your clinic or organization?",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: [
          "Solo clinic (1-2 doctors)",
          "Small clinic (3-5 staff)",
          "Medium clinic (6-15 staff)",
          "Large clinic / medical center",
          "Hospital / group of clinics",
        ],
      },
    ],
  },
  {
    id: "section_a",
    title: "Clinic Owner / Manager",
    questions: [
      {
        id: "owner_current_system",
        type: "multiple_choice",
        question: "How do you currently manage appointments? (Select all that apply)",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: [
          "Paper / manual booking",
          "WhatsApp / phone calls",
          "Spreadsheet (Excel / Google Sheets)",
          "Existing clinic software",
          "No structured system",
        ],
      },
      {
        id: "owner_biggest_problem",
        type: "multiple_choice",
        question: "What are your biggest operational challenges? (Select up to 3)",
        maxSelections: 3,
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: [
          "Long patient queues",
          "Staff overload",
          "Missed or double bookings",
          "Slow payment process",
          "Medicine dispensing delays",
          "Inventory tracking issues",
          "Patient complaints",
        ],
      },
      {
        id: "owner_queue_severity",
        type: "number_rating",
        question: "How serious are your patient queue issues?",
        min: 1,
        max: 10,
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
      },
      {
        id: "owner_otc_sales",
        type: "single_choice",
        question: "Do you sell non-prescription (OTC) medications?",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: ["Yes", "No", "Not sure"],
      },
      {
        id: "owner_otc_handling",
        type: "single_choice",
        question: "How are OTC medications currently handled?",
        condition: {
          all: [
            { questionId: "role", equals: "Clinic Owner / Manager" },
            { questionId: "owner_otc_sales", equals: "Yes" },
          ],
        },
        options: [
          "Manual dispensing by staff",
          "Pharmacy counter",
          "Combined with consultation",
          "Not structured",
        ],
      },
      {
        id: "owner_self_otc_interest",
        type: "single_choice",
        question:
          "Would you allow patients to self-purchase OTC medications with safeguards?",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: ["Yes", "Maybe, with strict controls", "No"],
      },
      {
        id: "owner_feature_interest",
        type: "matrix_rating",
        question: "Rate the usefulness of the following features:",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        items: [
          "Online appointment booking",
          "Walk-in queue system",
          "QR check-in",
          "Self-service medicine purchase",
          "Inventory tracking",
          "Staff dashboard",
        ],
        min: 1,
        max: 5,
      },
      {
        id: "owner_pricing_model",
        type: "single_choice",
        question: "What pricing model do you prefer?",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: [
          "Monthly subscription",
          "One-time purchase",
          "Pay per use",
          "Not sure",
        ],
      },
      {
        id: "owner_monthly_budget",
        type: "single_choice",
        question: "What monthly price would you consider reasonable?",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: [
          "Below RM50",
          "RM50 - RM100",
          "RM100 - RM300",
          "RM300 - RM500",
          "Above RM500",
        ],
      },
      {
        id: "owner_extra_pay",
        type: "multiple_choice",
        question: "What would you pay extra for?",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: [
          "Self-service kiosk",
          "Medicine collection locker",
          "Multi-branch management",
          "Priority support",
          "Data analytics dashboard",
        ],
      },
      {
        id: "owner_adoption_barrier",
        type: "multiple_choice",
        question: "What would stop you from using this system?",
        condition: {
          all: [{ questionId: "role", equals: "Clinic Owner / Manager" }],
        },
        options: [
          "Cost",
          "Staff resistance",
          "Training difficulty",
          "Reliability concerns",
          "Internet dependency",
          "Compliance / legal concerns",
        ],
      },
    ],
  },
  {
    id: "section_b",
    title: "Doctor",
    questions: [
      {
        id: "doctor_pain",
        type: "multiple_choice",
        question: "What affects your daily workflow the most?",
        condition: {
          all: [{ questionId: "role", equals: "Doctor" }],
        },
        options: [
          "Patient queue delays",
          "Overbooking",
          "Administrative work",
          "Poor patient flow",
          "Lack of patient information",
        ],
      },
      {
        id: "doctor_queue_impact",
        type: "single_choice",
        question: "Do long queues affect your consultation quality?",
        condition: {
          all: [{ questionId: "role", equals: "Doctor" }],
        },
        options: ["Yes", "No", "Sometimes"],
      },
      {
        id: "doctor_feature_interest",
        type: "matrix_rating",
        question: "Rate the usefulness:",
        condition: {
          all: [{ questionId: "role", equals: "Doctor" }],
        },
        items: [
          "Real-time queue visibility",
          "Pre-visit patient info",
          "Reduced admin interaction",
        ],
        min: 1,
        max: 5,
      },
      {
        id: "doctor_otc_opinion",
        type: "single_choice",
        question: "Should patients be allowed to self-purchase OTC medication?",
        condition: {
          all: [{ questionId: "role", equals: "Doctor" }],
        },
        options: ["Yes", "Yes, with restrictions", "No"],
      },
      {
        id: "doctor_concern",
        type: "multiple_choice",
        question: "What concerns you most about self-dispensary?",
        condition: {
          all: [{ questionId: "role", equals: "Doctor" }],
        },
        options: [
          "Misuse of medication",
          "Overdose risk",
          "Lack of guidance",
          "Legal responsibility",
        ],
      },
    ],
  },
  {
    id: "section_c",
    title: "Nurse / Staff",
    questions: [
      {
        id: "staff_tasks",
        type: "multiple_choice",
        question: "What takes most of your time?",
        condition: {
          all: [{ questionId: "role", equals: "Nurse / Clinic Staff" }],
        },
        options: [
          "Registration",
          "Queue handling",
          "Payments",
          "Dispensing medication",
          "Admin tasks",
        ],
      },
      {
        id: "staff_frustration",
        type: "multiple_choice",
        question: "What frustrates you most?",
        condition: {
          all: [{ questionId: "role", equals: "Nurse / Clinic Staff" }],
        },
        options: [
          "Repetitive tasks",
          "Angry patients",
          "Long queues",
          "Manual tracking",
          "Miscommunication",
        ],
      },
      {
        id: "staff_feature_value",
        type: "matrix_rating",
        question: "Rate usefulness:",
        condition: {
          all: [{ questionId: "role", equals: "Nurse / Clinic Staff" }],
        },
        items: [
          "Automated queue system",
          "QR check-in",
          "Self-checkout for OTC",
          "Inventory tracking",
        ],
        min: 1,
        max: 5,
      },
      {
        id: "staff_otc_impact",
        type: "single_choice",
        question: "Would self-service OTC reduce your workload?",
        condition: {
          all: [{ questionId: "role", equals: "Nurse / Clinic Staff" }],
        },
        options: ["Yes", "No", "Not sure"],
      },
    ],
  },
  {
    id: "section_d",
    title: "Patient / Customer",
    questions: [
      {
        id: "patient_visit_method",
        type: "single_choice",
        question: "How do you usually visit clinics?",
        condition: {
          all: [{ questionId: "role", equals: "Patient / Customer" }],
        },
        options: ["Walk-in", "Call to book", "Online booking"],
      },
      {
        id: "patient_pain",
        type: "multiple_choice",
        question: "What annoys you most?",
        condition: {
          all: [{ questionId: "role", equals: "Patient / Customer" }],
        },
        options: [
          "Long waiting time",
          "No queue visibility",
          "Repeating information",
          "Slow payment process",
        ],
      },
      {
        id: "patient_interest",
        type: "multiple_choice",
        question: "Would you use an app to:",
        condition: {
          all: [{ questionId: "role", equals: "Patient / Customer" }],
        },
        options: ["Book appointments", "Check queue status", "Buy OTC medicine early"],
      },
      {
        id: "patient_otc_usage",
        type: "single_choice",
        question: "Do you buy basic medication from clinics?",
        condition: {
          all: [{ questionId: "role", equals: "Patient / Customer" }],
        },
        options: ["Yes", "No"],
      },
      {
        id: "patient_otc_self",
        type: "single_choice",
        question: "Would you use self-checkout for medicine?",
        condition: {
          all: [{ questionId: "role", equals: "Patient / Customer" }],
        },
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: "patient_trust",
        type: "multiple_choice",
        question: "What builds your trust in such a system?",
        condition: {
          all: [{ questionId: "role", equals: "Patient / Customer" }],
        },
        options: [
          "Doctor recommendation",
          "Clear instructions",
          "Secure payment",
          "Brand reputation",
        ],
      },
    ],
  },
  {
    id: "section_e",
    title: "General Public",
    questions: [
      {
        id: "public_experience",
        type: "single_choice",
        question: "Have you experienced long clinic wait times?",
        condition: {
          all: [{ questionId: "role", equals: "General Public" }],
        },
        options: ["Yes", "No"],
      },
      {
        id: "public_interest",
        type: "multiple_choice",
        question: "Would you use a system that:",
        condition: {
          all: [{ questionId: "role", equals: "General Public" }],
        },
        options: [
          "Lets you book appointments",
          "Shows real-time waiting time",
          "Allows fast medicine collection",
        ],
      },
      {
        id: "public_pay",
        type: "single_choice",
        question: "Would you pay for convenience?",
        condition: {
          all: [{ questionId: "role", equals: "General Public" }],
        },
        options: ["Yes", "No"],
      },
      {
        id: "public_amount",
        type: "single_choice",
        question: "How much would you pay per visit?",
        condition: {
          all: [
            { questionId: "role", equals: "General Public" },
            { questionId: "public_pay", equals: "Yes" },
          ],
        },
        options: ["RM1 - RM5", "RM5 - RM10", "Subscription model"],
      },
    ],
  },
  {
    id: "section_final",
    title: "Final Section",
    questions: [
      {
        id: "overall_interest",
        type: "single_choice",
        question: "Would you use or support a system like this?",
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: "must_have_feature",
        type: "text",
        question: "What is one feature you MUST have?",
      },
      {
        id: "main_concern",
        type: "text",
        question: "What is your biggest concern about this system?",
      },
      {
        id: "contact_name",
        type: "text",
        question: "Name",
      },
      {
        id: "contact_info",
        type: "text",
        question: "Email",
      },
      {
        id: "early_access",
        type: "single_choice",
        question: "Would you like early access to QuickKlinik?",
        options: ["Yes", "No"],
      },
    ],
  },
];
