/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import Accessibility from './pages/Accessibility';
import AccessibilityStatement from './pages/AccessibilityStatement';
import AdminBoosterTasks from './pages/AdminBoosterTasks';
import AdminQuestionnaireExport from './pages/AdminQuestionnaireExport';
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
import HomePreview from './pages/HomePreview';
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
    "AdminQuestionnaireExport": AdminQuestionnaireExport,
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
    "HomePreview": HomePreview,
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