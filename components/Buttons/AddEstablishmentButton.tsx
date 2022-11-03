import { PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";


export const AddEstablishmentButton = ()=>{
    const router = useRouter();
    return (
        <button
            onClick={async () => {
                await router.push({
                pathname: '/establecimientos/nuevo'
                });
            }}
            className="flex bg-inherent text-primary border-none text-sm font-bold mt-1.5"
            >
            <span className="mr-1 mt-0.5">
                <PlusIcon className=" w-4 mx-1 text-primary" />
            </span>
            Agregar establecimiento
        </button>
    )
}