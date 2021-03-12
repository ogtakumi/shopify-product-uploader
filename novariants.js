const axios = require('axios').default;
const fs = require('fs')
const list = []
const CSVToJSON = require('csvtojson');
const imageToBase64 = require('image-to-base64');
const novariantcsv = 'E:\\1stAPP\\products-no-variant.csv';

const photo_dir = 'E:\\1stAPP\\Pictures\\';

const test = async ()=>{
  
  try {

  
  const ProductVariants = await CSVToJSON().fromFile(novariantcsv)

  for (i=0; i<165; i++){
    
    console.log('this is: ', i)
    
    let files = fs.readdirSync(photo_dir.concat(`${ProductVariants[i].index}`))

    let res= await axios.post('https://esihome-store.myshopify.com/admin/api/2021-01/products.json', 
    { 
        product:{
        title: ProductVariants[i].Title,
        vendor: ProductVariants[i].Vendor,
        product_type: ProductVariants[i].Type,
        published: ProductVariants[i].Published,
        variants:[{
          option1: ProductVariants[i].Option1Value,
          price:ProductVariants[i].Price,
          sku:ProductVariants[i].SKU
        }],
        status: ProductVariants[i].Status
        
    },   
        api_key: "ed8b4ebe8dd7a6febcabda4d1b9c59ff",
        access_token: "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"
    })
    
        ProductID = res.data.product.id; 

        await axios.post('https://esihome-store.myshopify.com/admin/api/2021-01/collects.json',{
          collect:{
            product_id: ProductID,
            collection_id: ProductVariants[i].Collection
          },
          api_key: "ed8b4ebe8dd7a6febcabda4d1b9c59ff",
          access_token: "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"

        })


    for (let j=0; j<files.length; j++){
      const productimage = await imageToBase64(photo_dir.concat(`${ProductVariants[i].index}\\${files[j]}`))
  

      await axios.post('https://esihome-store.myshopify.com/admin/api/2021-01/products/'+ProductID+'/images.json', 
      { 
        image:{
          attachment: productimage,
        },
    
        api_key: "ed8b4ebe8dd7a6febcabda4d1b9c59ff",
        access_token: "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"

      })
    }
   
  
    for(n=0;n<10000;n++){}
    
  }}catch(error){
    console.log(error.message)
  }
  }


test();

