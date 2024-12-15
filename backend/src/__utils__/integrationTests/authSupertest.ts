import User from "domain/entities/User";
import loginUser from "./loginUser";
import Test from "supertest/lib/test";

async function authSupertest(props: { user: User; plainPassword: string; agent: Test }) {
    const { user, plainPassword, agent } = props;
    const jwtToken = await loginUser(user, plainPassword);
    agent.set("Authorization", `Bearer ${jwtToken}`);
    return agent;
}

export default authSupertest;
