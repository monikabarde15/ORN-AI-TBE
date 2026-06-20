interface SessionFormProps {
    students: any[];
    uniqueStudents: any[];
    selectedStudent: any;
    setSelectedStudent: (student: any) => void;

    sessionTitle: string;
    setSessionTitle: (value: string) => void;

    trainerName: string;
    setTrainerName: (value: string) => void;

    meetingLink: string;
    setMeetingLink: (value: string) => void;

    sessionDate: string;
    setSessionDate: (value: string) => void;

    startTime: string;
    setStartTime: (value: string) => void;

    endTime: string;
    setEndTime: (value: string) => void;

    sessionDescription: string;
    setSessionDescription: (
        value: string
    ) => void;

    creating: boolean;

    createLiveSession: () => void;

    setShowSessionForm: (
        value: boolean
    ) => void;
}

export default function SessionForm({
    students,
    uniqueStudents,
    selectedStudent,
    setSelectedStudent,

    sessionTitle,
    setSessionTitle,

    trainerName,
    setTrainerName,

    meetingLink,
    setMeetingLink,

    sessionDate,
    setSessionDate,

    startTime,
    setStartTime,

    endTime,
    setEndTime,

    sessionDescription,
    setSessionDescription,

    creating,

    createLiveSession,

    setShowSessionForm,
}: SessionFormProps) {
    return (
        <div>

            <div className="mb-4 rounded-xl bg-slate-50 p-4">
                <p className="font-semibold">
                    Learning Path Students
                </p>

                <select
                    value={
                        selectedStudent?.paymentId ||
                        ""
                    }
                    onChange={(e) => {
                        const student =
                            students.find(
                                (s) =>
                                    s.paymentId ===
                                    e.target.value
                            );

                        setSelectedStudent(
                            student
                        );
                    }}
                    className="mt-3 w-full rounded-xl border p-3"
                >
                    <option value="">
                        Select Student
                    </option>

                    {uniqueStudents.map(
                        (s: any) => (
                            <option
                                key={s.paymentId}
                                value={
                                    s.paymentId
                                }
                            >
                                {s.studentName}
                                {" - "}
                                {s.studentEmail}
                            </option>
                        )
                    )}
                </select>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">

                <input
                    value={sessionTitle}
                    onChange={(e) =>
                        setSessionTitle(
                            e.target.value
                        )
                    }
                    placeholder="Session Title"
                    className="rounded-xl border p-3"
                />

                <input
                    value={trainerName}
                    onChange={(e) =>
                        setTrainerName(
                            e.target.value
                        )
                    }
                    placeholder="Trainer Name"
                    className="rounded-xl border p-3"
                />

                <input
                    value={meetingLink}
                    onChange={(e) =>
                        setMeetingLink(
                            e.target.value
                        )
                    }
                    placeholder="Meeting Link"
                    className="rounded-xl border p-3"
                />

                <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) =>
                        setSessionDate(
                            e.target.value
                        )
                    }
                    className="rounded-xl border p-3"
                />

                <input
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                        setStartTime(
                            e.target.value
                        )
                    }
                    className="rounded-xl border p-3"
                />

                <input
                    type="time"
                    value={endTime}
                    onChange={(e) =>
                        setEndTime(
                            e.target.value
                        )
                    }
                    className="rounded-xl border p-3"
                />

            </div>

            <textarea
                rows={4}
                value={sessionDescription}
                onChange={(e) =>
                    setSessionDescription(
                        e.target.value
                    )
                }
                placeholder="Description"
                className="mt-4 w-full rounded-xl border p-3"
            />

            <button
                onClick={createLiveSession}
                disabled={creating}
                className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-white"
            >
                {creating
                    ? "Creating..."
                    : "Create Session"}
            </button>

        </div>
    );
}