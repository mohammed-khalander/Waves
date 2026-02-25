import { ComponentExample } from "@/components/component-example";

import prisma from "@/lib/prisma";

export default async function Page() {

    const users = await prisma.user.findMany();

return(
    <>
        <ul>
            {
                users.map((user)=>{
                    return(
                        <li>
                            {user.name}
                        </li>
                    )
                })
            }
        </ul>
        {JSON.stringify(users,null,2)}
        <ComponentExample />
    </>
) 
}