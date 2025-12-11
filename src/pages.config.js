import Home from './pages/Home';
import Questionnaire from './pages/Questionnaire';
import ThankYou from './pages/ThankYou';
import Payment from './pages/Payment';
import Completion from './pages/Completion';
import EmailTemplates from './pages/EmailTemplates';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleDetails from './pages/ArticleDetails';
import TermsOfService from './pages/TermsOfService';
import AdminReports from './pages/AdminReports';
import ReportView from './pages/ReportView';
import QuestionnaireExport from './pages/QuestionnaireExport';
import Survey from './pages/Survey';
import MyAccount from './pages/MyAccount';
import BoosterRegistration from './pages/BoosterRegistration';
import BoosterContinuation from './pages/BoosterContinuation';
import BoosterPayment from './pages/BoosterPayment';
import BoosterThankYou from './pages/BoosterThankYou';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Questionnaire": Questionnaire,
    "ThankYou": ThankYou,
    "Payment": Payment,
    "Completion": Completion,
    "EmailTemplates": EmailTemplates,
    "About": About,
    "Articles": Articles,
    "ArticleDetails": ArticleDetails,
    "TermsOfService": TermsOfService,
    "AdminReports": AdminReports,
    "ReportView": ReportView,
    "QuestionnaireExport": QuestionnaireExport,
    "Survey": Survey,
    "MyAccount": MyAccount,
    "BoosterRegistration": BoosterRegistration,
    "BoosterContinuation": BoosterContinuation,
    "BoosterPayment": BoosterPayment,
    "BoosterThankYou": BoosterThankYou,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};