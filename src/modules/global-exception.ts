export class GlobalExpcetion {
    constructor(){
        this.initEvents();
    }    
    destroy() {
        this.unInitEvents()
    }
    initEvents() {
        process.on('uncaughtException', this.uncaughtException)
        process.on('unhandledRejection', this.unhandledRejection)
    }
    unInitEvents() {
        process.off('uncaughtException', this.uncaughtException)
        process.off('unhandledRejection', this.unhandledRejection) 
    }
    uncaughtException = (error: Error) => {
        console.log('uncaughtException:', error)
    }
    unhandledRejection =(reason: any, promise: Promise<any>) => {
        console.log('unhandledRejection:', reason);
    }
}
