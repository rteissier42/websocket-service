import { TestBed } from '@angular/core/testing'

import { LoggerService } from './logger.service'

describe('LoggerService Isolated', () => {
    let loggerService: LoggerService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        loggerService = TestBed.inject(LoggerService)
    })

    it('should be able to print an info in the browser console', () => {
        // Arrange
        const infoSpy = spyOn(console, 'info')
        const message = 'Infos: '
        const args = [
            { data: 'Something happened' },
            { data: 'Something happened' },
        ]

        // Act
        loggerService.info(message, args)

        // Assert
        expect(infoSpy).toHaveBeenCalledOnceWith(message, args)
    })

    it('should be able to print a log in the browser console', () => {
        // Arrange
        const logSpy = spyOn(console, 'log')
        const message = 'Logs: '
        const args = ['Something', 'happened']

        // Act
        loggerService.log(message, args)

        // Assert
        expect(logSpy).toHaveBeenCalledOnceWith(message, args)
    })

    it('should be able to print a warning in the browser console', () => {
        // Arrange
        const warnSpy = spyOn(console, 'warn')
        const message = 'Warning: '
        const args = 'Something happened'

        // Act
        loggerService.warn(message, args)

        // Assert
        expect(warnSpy).toHaveBeenCalledOnceWith(message, args)
    })
})
