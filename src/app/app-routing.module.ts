import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BrowserUtils } from "@azure/msal-browser";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";
import { MsalGuard, MsalRedirectComponent } from "@azure/msal-angular";

const routes: Routes = [
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [MsalGuard],
  },
  {
    path: "auth",
    component: MsalRedirectComponent,
  },
  {
    path: "",
    component: HomeComponent,
    canActivate: [MsalGuard]
  },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? "enabledNonBlocking"
          : "disabled", // Set to enabledBlocking to use Angular Universal
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}