import {Button} from "@/components/ui/button.tsx";
import {toast as toastManager} from "@/components/handler/toastHandler";

export default function ExampleHomepage() {

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant="outline"
                onClick={() =>
                    toastManager.success("Success!!")
                }
            >
                Success
            </Button>
            <Button
                variant="outline"
                onClick={() => toastManager.error("Error!!")
                }
            >
                Error
            </Button>
        </div>
    )
}