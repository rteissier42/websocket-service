import { environment } from 'src/environments/environment'
import { Injectable } from '@angular/core'

interface ILoggerService {
    info<T>(message: string, ...args: T[]): void
    log<T>(message: string, ...args: T[]): void
    warn<T>(message: string, ...args: T[]): void
}

@Injectable({
    providedIn: 'root',
})
export class LoggerService implements ILoggerService {
    public info<T>(message: string, ...args: T[]): void {
        console.info(message, ...args)
    }

    public log<T>(message: string, ...args: T[]): void {
        if (!environment.production) {
            console.log(message, ...args)
        }
    }

    public warn<T>(message: string, ...args: T[]): void {
        console.warn(message, ...args)
    }
}
