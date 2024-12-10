import { Request, Response } from "express";

import { LoginDTO, LoginResponseDTO } from "@domain/gateway/repositories/user.gateway.repository";

import { AuthUserUsecase } from "@usecases/auth-user/auth-user.usecase";

import { HttpMethod, Route } from "..";

export type AuthUserResponseDto = {
    token: string;
}

export class AuthUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly authUserService: AuthUserUsecase,
    ) { }

    public static create(authUserService: AuthUserUsecase) {
        return new AuthUserRoute(
            "/login",
            HttpMethod.POST,
            authUserService,
        );
    }

    public getHandler(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            try {
                const { email, password } = request.body;

                const input: LoginDTO = {
                    email,
                    password,
                };

                const output: LoginResponseDTO = await this.authUserService.execute(input);

                response.status(201).json(output);
            } catch (error) {
                response.status(400).json({ message: error.message });
            }

        };
    }

    getPath(): string {
        return this.path;
    }

    getMethod(): HttpMethod {
        return this.method;
    }
}