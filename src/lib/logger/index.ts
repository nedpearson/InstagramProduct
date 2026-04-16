import { prisma } from '@/lib/prisma';

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';
type LogModule = 'agent' | 'auth' | 'billing' | 'queue' | 'webhook' | 'system';

interface LogContext {
  userId?: string;
  workspaceId?: string;
  jobId?: string;
  briefId?: string;
  [key: string]: any;
}

export class Logger {
  /**
   * Universal internal logger. Routes errors directly to the AuditLogs and DeadLetter models when required.
   */
  static async log(level: LogLevel, module: LogModule, message: string, context: LogContext = {}) {
    // 1. Console stream for local/container logs
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] [${module}] ${message} | Context: ${JSON.stringify(context)}`;
    
    if (level === 'error' || level === 'fatal') {
      console.error(formatted);
    } else {
      console.log(formatted);
    }

    // 2. Persist to DB for observable intelligence UI
    try {
      if (context.userId || context.workspaceId) {
        await prisma.auditLog.create({
          data: {
            userId: context.userId,
            action: `${level}_${module}: ${message}`,
            details: JSON.stringify(context),
            ipAddress: context.ipAddress || 'internal_system',
          }
        });
      }

      // If it's a fatal system error regarding a job or agent, we could dead letter it natively here.
      if (level === 'fatal' && context.jobId) {
         // Explicit dead lettering
         await prisma.deadLetterJob.create({
            data: {
               jobId: context.jobId,
               sourceModule: module,
               failureReason: message,
               stackTrace: context.stackTrace || '',
               firstFailedAt: new Date(),
               lastFailedAt: new Date()
            }
         });
      }
    } catch (dbError) {
      // Failsafe to ensure logging fails gracefully
      console.error(`Emergency log failure: unable to persist log to DB`, dbError);
    }
  }

  static info(module: LogModule, message: string, context?: LogContext) {
    return this.log('info', module, message, context);
  }

  static warn(module: LogModule, message: string, context?: LogContext) {
    return this.log('warn', module, message, context);
  }

  static error(module: LogModule, message: string, context?: LogContext) {
    return this.log('error', module, message, context);
  }

  static fatal(module: LogModule, message: string, context?: LogContext) {
    return this.log('fatal', module, message, context);
  }
}
