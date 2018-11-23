//引入核心依赖
import {NgModule,ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule,IonicErrorHandler} from 'ionic-angular';
//引入双向绑定，http请求依赖
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

//引入页面组件
import {MyApp} from './app.component';


//引入native
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Camera } from '@ionic-native/camera';
//引入自定义provider
import {HttpSerProvider} from '../providers/http-ser/http-ser';
import {PopSerProvider} from '../providers/pop-ser/pop-ser';



//引入自定义组件component  （也可以不全局引入，在需要的页面引入需要的组件）
import {ComponentsModule} from '../components/components.module';

//引入自定义过滤器pipe    （也可以不全局引入，在需要的页面引入需要的pipe）
import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
// import { ComunityListPage } from '../pages/comunity-list/comunity-list';
// import { GuardListPage } from '../pages/guard-list/guard-list';
// import { SettingPage } from '../pages/setting/setting';
// import { GuardSettingPage } from '../pages/guard-setting/guard-setting';


import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { PhotoLibrary } from '@ionic-native/photo-library';
import {MultiPickerModule} from 'ion-multi-picker'
import { ReviceServeProvider } from '../providers/revice-serve/revice-serve';
import { Network  } from "@ionic-native/network";
@NgModule({
    declarations: [
        MyApp,
        TabsPage,
        ContactPage,
        AboutPage,
        HomePage
        // ComunityListPage,
        // GuardListPage,
        // SettingPage,
        // GuardSettingPage
       
    ],
    imports: [
        BrowserModule,
        HttpModule,
        ComponentsModule,
        MultiPickerModule,
        IonicModule.forRoot(MyApp,{
            backButtonText: '',
            iconMode: 'ios',
            modalEnter: 'modal-slide-in',
            modalLeave: 'modal-slide-out',
            mode: 'ios',
            pageTransition: 'ios-transition',
            tabsHideOnSubPages: true,
            tabsPlacement: 'bottom',
                    
        
        })

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
       TabsPage,
       ContactPage,
       AboutPage,
       HomePage
    //    ComunityListPage,
    //     GuardListPage,
    //     SettingPage,
    //     GuardSettingPage
       
      
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        HttpSerProvider,
        PopSerProvider,
        PhotoViewer,
        UniqueDeviceID,
        Media,
        File,
        PhotoLibrary,
        FileTransfer,
        ReviceServeProvider,
        Network
    ]
})
export class AppModule {
}
