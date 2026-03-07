
interface Props{
    params:Promise<{projectID:string}>;
}


const Page = async({params}:Props)=>{

    const { projectID } = await params;

    return(
        <h1>
            New Project Created With ID : {projectID}
        </h1>
    )

}

export default Page