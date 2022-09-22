import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";

import Tables from "@/views/Tables.vue";
import Billing from "@/views/Billing.vue";
import VirtualReality from "@/views/VirtualReality.vue";
import Profile from "@/views/Profile.vue";
import Rtl from "@/views/Rtl.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import Users from "@/views/Users.vue";
import UserDevices from "@/views/UserDevices.vue";
import UserDeviceReports from "@/views/UserDeviceReports.vue";
import ConsentReports from "@/views/ConsentReports.vue";
import StudyDataPage from "@/views/StudyDataPage.vue"
import AddParticipants from "@/views/AddParticipants.vue"
import SendStartEmail from "@/views/SendStartEmail.vue"

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/user-devices",
    name: "User Devices",
    component: UserDevices,
  },
  {
    path: "/user-device-reports",
    name: "User Device Reports",
    component: UserDeviceReports,
  },
  {
    path: "/consent-reports",
    name: "Consent Reports",
    component: ConsentReports,
  },
  {
    path: "/add-participants",
    name: "Add Participants",
    component: AddParticipants,
  },
  {
    path: "/send-start-email",
    name: "Send Start Email",
    component: SendStartEmail
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/rtl-page",
    name: "Rtl",
    component: Rtl,
  },
  {
    path: "/sign-in",
    name: "Sign In",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "Sign Up",
    component: SignUp,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
  { 
    path: '/studydata/:id', 
    component: StudyDataPage, 
    props: true 
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
