import About from './pages/About';
import Accessibility from './pages/Accessibility';
import AccessibilityStatement from './pages/AccessibilityStatement';
import AdminBoosterTasks from './pages/AdminBoosterTasks';
import AdminReports from './pages/AdminReports';
import ArticleDetails from './pages/ArticleDetails';
import Articles from './pages/Articles';
import BoosterContinuation from './pages/BoosterContinuation';
import BoosterPayment from './pages/BoosterPayment';
import BoosterRegistration from './pages/BoosterRegistration';
import BoosterThankYou from './pages/BoosterThankYou';
import Completion from './pages/Completion';
import EmailTemplates from './pages/EmailTemplates';
import Home from './pages/Home';
import MyAccount from './pages/MyAccount';
import Payment from './pages/Payment';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Questionnaire from './pages/Questionnaire';
import QuestionnaireExport from './pages/QuestionnaireExport';
import ReportView from './pages/ReportView';
import Survey from './pages/Survey';
import TermsOfService from './pages/TermsOfService';
import ThankYou from './pages/ThankYou';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Accessibility": Accessibility,
    "AccessibilityStatement": AccessibilityStatement,
    "AdminBoosterTasks": AdminBoosterTasks,
    "AdminReports": AdminReports,
    "ArticleDetails": ArticleDetails,
    "Articles": Articles,
    "BoosterContinuation": BoosterContinuation,
    "BoosterPayment": BoosterPayment,
    "BoosterRegistration": BoosterRegistration,
    "BoosterThankYou": BoosterThankYou,
    "Completion": Completion,
    "EmailTemplates": EmailTemplates,
    "Home": Home,
    "MyAccount": MyAccount,
    "Payment": Payment,
    "PrivacyPolicy": PrivacyPolicy,
    "Questionnaire": Questionnaire,
    "QuestionnaireExport": QuestionnaireExport,
    "ReportView": ReportView,
    "Survey": Survey,
    "TermsOfService": TermsOfService,
    "ThankYou": ThankYou,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};