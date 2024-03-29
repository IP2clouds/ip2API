const fs = require('fs')
const AWS = require('aws-sdk')
const { fromPath } = require('pdf2pic')
AWS.config.update({
    accessKeyId: 'ACESS KEY ID HERE',
    secretAccessKey: 'SECRET ACESS KEY HERE',
    region: 'REGION HERE'
})
const { AWS_ACESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env



module.exports = {

    b64toimg(dadosrecebidos, id, req, res) {
        var buf = Buffer.from(`${dadosrecebidos["imagem"]}`, 'base64')
        fs.writeFileSync(`./saved-data/${id}.jpeg`, buf)
    },
    pegardatastring() {
        const date = new Date()
        const year = date.getFullYear()
        const month = `${date.getMonth() + 1}`.padStart(2, '0')
        const day = `${date.getDate()}`.padStart(2, '0')
        const seconds = `${date.getSeconds()}`.padStart(2, '0')
        return `${year}${month}${day}${seconds}`

    },
    uploads3(id, cpfrecebido) {
        const s3 = new AWS.S3()
        const filecontent = fs.readFileSync(`./saved-data/${id}.jpeg`)
        let cpf = cpfrecebido

        var params = {
            Body: filecontent,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            Bucket: "ip2-api-dev",
            Key: `source/${id}.jpeg`,
            Metadata: {
                "cpf": `${cpf}`
            }
        }
        s3.putObject(params, function (err, data) {
            if (err) console.log(err, err.stack)
            else console.log(data)

        })
    },
    uploadimgs3(id) {
        const s3 = new AWS.S3()
        const filecontent = fs.readFileSync(`./saved-data/${id}.1.jpeg`)
        var params = {
            Body: filecontent,
            Bucket: "ip2-api-dev",
            Key: `${id}.jpeg`,
        }
        s3.putObject(params, function (err, data) {
            if (err) console.log(err, err.stack)
            else console.log(data)

        })

    },
    pdftoimg(id) {
        const options = {
            density: 300,
            saveFilename: `${id}`,
            savePath: "./saved-data/",
            format: "jpeg",
            width: 2480,
            height: 3508
        };
        const storeAsImage = fromPath(`./saved-data/${id}.pdf`, options);
        const pageToConvertAsImage = 1;

        storeAsImage(pageToConvertAsImage).then((resolve) => {
            console.log("Convertido para imagem.");

            return resolve;
        });

    },
    limpararquivos(id) {
        fs.unlink(`./saved-data/${id}.pdf`, (err) => {
            if (err) console.log(err)
            else console.log('PDF Deletado')
        })
        fs.unlink(`./saved-data/${id}.1.jpeg`, (err) => {
            if (err) console.log(err)
            else console.log('JPEG Deletado')
        })
    }
}



