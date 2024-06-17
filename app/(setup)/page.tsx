import Initial_Modal from "@/components/modals/Initial_Modal"
import { db } from "@/lib/db"
import { InitialProfile } from "@/lib/initial-profile"
import { redirect } from "next/navigation"

const SetupPage = async () => {

    const profile = await InitialProfile()

    if (!profile) {
        throw new Error("Profile is null");
    }

    console.log(profile)


    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return (
        <div>
            <Initial_Modal/>
        </div>
    )
}

export default SetupPage