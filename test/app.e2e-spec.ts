import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { PrismaService } from "../src/prisma/prisma.service"
import { AppModule } from "../src/app.module"
import * as pactum from "pactum"
import { authDTO } from "src/auth/dto"

describe("App e2e", () => {
    let app: INestApplication
    let prisma: PrismaService
    beforeAll(async () => {
        const moduleRef =
            await Test.createTestingModule({
                imports: [AppModule]
            }).compile()
        app = moduleRef.createNestApplication()
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true
        }))
        await app.init()
        await app.listen(3333)


        prisma = app.get(PrismaService)
        await prisma.cleanUp()
        pactum.request.setBaseUrl("http://localhost:3333")

    })
    afterAll(async () => {
        app.close()
    })

    describe("Auth", () => {
        const dto: authDTO = {
            email: "rezaa@mousavi.com",
            password: "reza"
        }
        describe('signup', () => {
            it("Should signup", () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(dto as authDTO)
                    .inspect()
                    .expectStatus(201)

            })
        })
        describe('Signin', () => {
            it("Should Signin", () => {
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(dto)
                    .inspect()
                    .expectStatus(201)
                    .stores("userAT", "access_token")
            })
        })
    })
    describe("User", () => {
        describe("Me", () => {
            it("me", () => {
                return pactum
                    .spec()
                    .get("/user/me")
                    .withHeaders({ Authorization: 'Bearer $S{userAT}' })
                    .inspect()
            })
        })
    })
    it.todo("should pass")
})