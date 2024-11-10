// app/components/ObjectDetection.js
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const ObjectDetection = {
  model: null,

  async loadModel() {
    if (!this.model) {
      this.model = await cocoSsd.load();
    }
  },

  async detectObjects(frame) {
    if (!this.model) {
      await this.loadModel();
    }

    // 프레임에서 이미지 데이터를 Tensor로 변환 후 감지 실행
    const imageTensor = tf.browser.fromPixels(frame);

    const predictions = await this.model.detect(imageTensor);
    predictions.forEach(prediction => {
      console.log(`Detected object: ${prediction.class} - ${prediction.score}`);
    });

    // Tensor 메모리 해제
    imageTensor.dispose();

    return predictions;
  },
};

export default ObjectDetection;
