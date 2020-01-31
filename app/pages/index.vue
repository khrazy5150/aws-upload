<template>
    <div class="container">
        <div>
          <h1 class="mid">S3 Uploader</h1>

          <div v-if="!image" class="mid">
            <h2>Select an image</h2>
            <input type="file" @change="onFileChange">
          </div>

          <div v-else class="mid">
            <img :src="image" />
            <button v-if="!uploadURL" @click="removeImage">Remove image</button>
            <button v-if="!uploadURL" @click="uploadImage">Upload image</button>
          </div>

          <h2 v-if="uploadURL">Success! Image uploaded to bucket.</h2>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const MAX_IMAGE_SIZE = 1000000;
const API_ENDPOINT = 'https://apiGatewayId.execute-api.us-west-2.amazonaws.com/prod/v1/upload-url';

export default {
    data () {
        return {
            image: '',
            uploadURL: ''
        }
    },
    methods: {
        onFileChange (e) {
            let files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.createImage(files[0])
        },
        createImage (file) {
            // var image = new Image()
            let reader = new FileReader()

            reader.onload = (e) => {
                console.log('length: ', e.target.result.includes('data:image/jpeg'))
                if (!e.target.result.includes('data:image/jpeg')) {
                    return alert('Wrong file type - JPG only.')
                }
                if (e.target.result.length > MAX_IMAGE_SIZE) {
                    return alert('Image is loo large - 1Mb maximum')
                }
                this.image = e.target.result
            }

            reader.readAsDataURL(file)
        },
        removeImage: function (e) {
            console.log('Remove clicked')
            console.log(e)

            this.image = ''
        },
        uploadImage: async function (e) {
            console.log('Upload clicked')
            console.log(e)
            
            // Get the presigned URL
            const response = await axios({
                method: 'GET',
                url: API_ENDPOINT
            })
            console.log('Response: ', response.data)
            console.log('Uploading: ', this.image)
            console.log('Type: ', this.image.data )
            let binary = atob(this.image.split(',')[1])
            let array = []
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i))
            }
            let blobData = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
            console.log('File size: ', blobData.size);
            console.log('Uploading to: ', response.data.uploadURL);

            const result = await fetch(response.data.uploadURL, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'image/jpeg',
                    'Content-Length': blobData.size, 
                    'x-amz-acl': 'public-read' },
                body: blobData
            })

            // const result = await axios.put(response.data.uploadURL, null, blobData, { 
            //     isMultipartForm: false, 
            //     headers: { 'Content-Type': blobData.type } 
            // });

            console.log('Result: ', result)
            // Final URL for the user doesn't need the query string params
            this.uploadURL = response.data.uploadURL.split('?')[0]
        }
    }
}
</script>

<style scoped>
body {
  background: #20262E;
  padding: 20px;
  font-family: sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mid {
  text-align: center;
}

#app {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.2s;
  text-align: center;
}

#logo {
  width: 100px;
}

h2 {
  font-weight: bold;
  margin-bottom: 15px;
}

h1, h2 {
  font-weight: normal;
  margin-bottom: 15px;
}
a {
  color: #42b983;
}
img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
</style>