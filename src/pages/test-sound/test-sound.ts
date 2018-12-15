import {Component} from '@angular/core';
import {App,IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpSerProvider} from '../../providers/http-ser/http-ser';
import {PopSerProvider} from '../../providers/pop-ser/pop-ser';

/**
 * Generated class for the TestSoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-test-sound',
  templateUrl: 'test-sound.html',
})
export class TestSoundPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestSoundPage');
    this.load();
  }

  public load(){
    navigator.mediaDevices.getUserMedia({ audio: true}).then(
      function(mediaStream) {
          // 一些初始化
         
          const audioContext = new AudioContext();
          const sourceNode = audioContext.createMediaStreamSource(mediaStream);
          const scriptNode = audioContext.createScriptProcessor(
            4096, 1, 1
          );
          sourceNode.connect(scriptNode);
          scriptNode.connect(audioContext.destination);

          console.log(scriptNode);
          scriptNode.onaudioprocess = function(audioProcessingEvent) {
            // The input buffer is the song we loaded earlier
            var inputBuffer = audioProcessingEvent.inputBuffer;
          
            // The output buffer contains the samples that will be modified and played
            var outputBuffer = audioProcessingEvent.outputBuffer;
          
            // Loop through the output channels (in this case there is only one)
            for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
              var inputData = inputBuffer.getChannelData(channel);
              var outputData = outputBuffer.getChannelData(channel);
          
              // Loop through the 4096 samples
              for (var sample = 0; sample < inputBuffer.length; sample++) {
                // make output equal to the same as the input
                outputData[sample] = inputData[sample];
          
                // add noise to each output sample
                outputData[sample] += ((Math.random() * 2) - 1) * 0.2;         
              }
            }
            console.log(outputData.length);
          }

          window.setTimeout(() =>  scriptNode.disconnect(audioContext.destination), 5000);
         
         
          // 监听录音的过程
          // scriptNode.onaudioprocess = event => {
          //   if (!this.isRecording) return; // 判断是否正则录音
          //   this.buffers.push(event.inputBuffer.getChannelData(0)); // 获取当前频道的数据，并写入数组
          // };



      },
      function(error) {
        // 失败
      
       
        let errorMessage;
        switch (error) {
          // 用户拒绝
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            errorMessage = '用户已禁止网页调用录音设备';
            break;
          // 没接入录音设备
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            errorMessage = '录音设备未找到';
            break;
          // 其它错误
          case 'NotSupportedError':
            errorMessage = '不支持录音功能';
            break;
          default:
            errorMessage = '录音调用错误';
            console.log(error);
            alert(error);
        }
        return errorMessage;
      }
    );

      

  }

}
