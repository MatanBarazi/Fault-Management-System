var myPromise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("executed..")
    },3000)
})
function test1(){
    console.log("check");
}
async function invokingPromise(){
    await myPromise.then((data)=>{
        console.log(data);
    })
    console.log("execution Complete..");

}
invokingPromise();
test1();
