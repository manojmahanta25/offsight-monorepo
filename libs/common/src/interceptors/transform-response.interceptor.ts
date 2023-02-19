import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, BadRequestException } from "@nestjs/common";
import { map, Observable, catchError, throwError } from "rxjs";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(value => {
        value = value ? value : "";
        return { status: "success", data: value };
      }),
      catchError(err => {
        console.log("HERE@1212", context);
        if (err instanceof HttpException) {
          return throwError(() => err);
        } else {
          //TODO add logger for error
          console.log(err);
          return throwError(() => new HttpException("Bad Request", 400));
        }
      }),
    );
  }
}
