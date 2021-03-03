function errHandler(err) {
    console.log(err)
}

const handleUncaughtErr = () => {
    process.on('unhandledRejection',errHandler); // 비동기
    process.on('uncaughtException',errHandler); // 동기 
} 

module.exports = {
    handleUncaughtErr,
}