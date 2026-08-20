import {Button} from "@/components/ui/button.tsx";

export default function ExampleHomepage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 space-y-6">
            {/* Layer: @theme inline → :root indirection */}
            <h1 className="text-h1">Design system test</h1>

            {/* Layer: plain @theme, typography pair */}
            <p className="text-body">
                If this paragraph is 16px with normal line spacing, the
                text-{"{name}"}/text-{"{name}"}--line-height pairing works.
            </p>

            {/* Layer: raw @theme color, no indirection */}
            <div className="bg-teal-500 text-white p-4 rounded">
                Raw teal-500 background — tests @theme literals directly.
            </div>

            {/* Layer: shadcn component, using @theme inline primary/foreground */}
            <Button>Primary button</Button>
            <Button variant="destructive">Destructive button</Button>

            {/* Layer: custom @utility */}
            <p className="label-micro">eyebrow label test</p>

            {/* Layer: :focus-visible base rule — tab to this and look for the ring */}
            <input
                className="border border-border rounded px-3 py-2"
                placeholder="Tab into me, check focus ring"
            />
        </div>
    )
}