export default function LandingPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="bg-teal-700 text-white p-8 md:p-8 flex flex-col justify-between">
                <div className="m-20 space-y-10">
                    {/* placeholder de logo*/}
                    <div className="w-30 h-30 rounded-full border-5 border-white" />
                    <h1 className="text-[60px] font-black tracking-tight">
                        GRADE-M8
                    </h1>
                </div>
                <blockquote className="m-20 border-l-4 border-white/40 pl-4 text-[30px] font-semibold tracking-wider">
                    Precisión académica estricta, procesada y estructurada
                    para el alto rendimiento.
                </blockquote>
            </div>
            <div className="bg-background">
            </div>
        </div>
    )
}