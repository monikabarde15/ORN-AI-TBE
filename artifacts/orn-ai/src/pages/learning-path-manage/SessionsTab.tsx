interface SessionsTabProps {
    sessions: any[];
    setShowSessionForm: (
        value: boolean
    ) => void;
}

export default function SessionsTab({
    sessions,
    setShowSessionForm,
}: SessionsTabProps) {
    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Live Sessions
                    </h2>

                    <p className="text-sm text-slate-500">
                        Sessions created for this learning path
                    </p>
                </div>

                <button
                    onClick={() =>
                        setShowSessionForm(true)
                    }
                    className="rounded-xl bg-blue-600 px-5 py-3 text-white"
                >
                    Add Live Session
                </button>
            </div>

            {sessions.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
                    No live sessions created yet
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                    {sessions.map(
                        (session: any) => (
                            <div
                                key={
                                    session.id ||
                                    session._id
                                }
                                className="
                                    overflow-hidden
                                    rounded-3xl
                                    bg-white
                                    shadow-sm
                                    transition-all
                                    hover:-translate-y-1
                                    hover:shadow-xl
                                "
                            >

                                <img
                                    src={
                                        session
                                            .learningPath
                                            ?.image ||
                                        "https://placehold.co/600x400"
                                    }
                                    className="
                                        h-32
                                        w-full
                                        object-cover
                                    "
                                    alt={
                                        session.sessionTitle
                                    }
                                />

                                <div className="p-4">

                                    <div className="mb-3">

                                        <h2 className="truncate text-sm font-semibold">
                                            {
                                                session
                                                    .learningPath
                                                    ?.title ||
                                                "Learning Path"
                                            }
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                line-clamp-2
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            {
                                                session
                                                    .learningPath
                                                    ?.description ||
                                                "Live learning session"
                                            }
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3">

                                        <div className="flex items-center gap-2">

                                            <span className="text-xs font-semibold">
                                                Session
                                            </span>

                                        </div>

                                        <h3 className="mt-2 truncate text-sm font-semibold">
                                            {
                                                session.sessionTitle
                                            }
                                        </h3>

                                        <div className="mt-2 space-y-1 text-xs text-slate-500">

                                            <p>
                                                👨‍🏫{" "}
                                                {
                                                    session.trainerName ||
                                                    "-"
                                                }
                                            </p>

                                            <p>
                                                📅{" "}
                                                {
                                                    session.sessionDate ||
                                                    "-"
                                                }
                                            </p>

                                            <p>
                                                ⏰{" "}
                                                {
                                                    session.startTime
                                                }
                                                {" - "}
                                                {
                                                    session.endTime
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}