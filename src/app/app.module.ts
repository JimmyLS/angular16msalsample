import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";

import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor, MsalInterceptorConfiguration, MsalGuardConfiguration, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalService, MsalBroadcastService } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType, LogLevel, IPublicClientApplication } from "@azure/msal-browser";

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

export function MSALInstanceFactory(): IPublicClientApplication{
  console.log('We are getting MSALInstanceFactory instance');
  return new PublicClientApplication(
    {
          auth: {
            clientId: "10af61e6-2a34-4c97-b183-9805465957cb", // Application (client) ID from the app registration
            authority:
              "https://login.microsoftonline.com/386b5de9-1fc0-48d5-a6dd-c2374f5b0de8", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
            redirectUri: "http://localhost:4200/auth", // This is your redirect URI
          },
          cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
          },
          system: {
            allowNativeBroker: false,
            loggerOptions: {
              loggerCallback,
              logLevel: LogLevel.Verbose,
              piiLoggingEnabled: true
            }
          }
        }
  )
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  console.log('We are getting MSALInterceptorConfigFactory instance');
  return {
    interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
    protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
        ]),
  }
}

export function MsalGuardConfigurationFactory(): MsalGuardConfiguration {
  console.log('We are getting MSALGuardConfigFactory instance');
  return {
    interactionType: InteractionType.Redirect,  // MSAL GUARD configuration
        authRequest: {
          scopes: ["user.read"],
  }
 }
}

@NgModule({
  declarations: [AppComponent, HomeComponent, ProfileComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    HttpClientModule,
    MsalModule,
    // MsalModule.forRoot(
    //   new PublicClientApplication(
    //     {
    //     auth: {
    //       clientId: "10af61e6-2a34-4c97-b183-9805465957cb", // Application (client) ID from the app registration
    //       authority:
    //         "https://login.microsoftonline.com/386b5de9-1fc0-48d5-a6dd-c2374f5b0de8", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
    //       redirectUri: "http://localhost:4200", // This is your redirect URI
    //     },
    //     cache: {
    //       cacheLocation: "localStorage",
    //       storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
    //     },
    //     system: {
    //       allowNativeBroker: false,
    //       loggerOptions: {
    //         loggerCallback,
    //         logLevel: LogLevel.Verbose,
    //         piiLoggingEnabled: true
    //       }
    //     }
    //   }),
    //   {
    //     interactionType: InteractionType.Redirect,  // MSAL GUARD configuration
    //     authRequest: {
    //       scopes: ["user.read"],
    //     }
    //   },
    //   {
    //     interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
    //     protectedResourceMap: new Map([
    //       ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
    //     ]),
    //   }
    // ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalBroadcastService,
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}