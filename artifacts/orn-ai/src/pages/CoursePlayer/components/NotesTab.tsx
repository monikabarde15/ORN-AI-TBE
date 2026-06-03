const dummyNotes = [
  {
    id: 1,
    title: "Important Concept",
    note: "Remember to review this lesson before taking the quiz.",
  },
  {
    id: 2,
    title: "Revision",
    note: "Practice examples from chapter 2.",
  },
];

const NotesTab = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Notes
            </h2>

            <p className="mt-2 text-gray-500">
              Personal notes for this course.
            </p>
          </div>

          <button
            className="
              rounded-xl
              bg-red-500
              px-5
              py-3
              text-white
            "
          >
            Add Note
          </button>
        </div>
      </div>

      {dummyNotes.map((note) => (
        <div
          key={note.id}
          className="
            rounded-3xl
            bg-white
            p-6
            shadow-sm
          "
        >
          <h3 className="font-semibold">
            {note.title}
          </h3>

          <p className="mt-3 text-gray-600">
            {note.note}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotesTab;