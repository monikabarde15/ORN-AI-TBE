"use client"

import React, {
  useEffect,
  useState,
} from "react"

import {
  UploadCloud,
  Video,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react"

import {
  toast,
  Toaster,
} from "react-hot-toast"

import { Shell }
from "@/components/layout/Shell"

import api
from "../../services/api"

import "./CreateCourse.css"

const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200MB
const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB

const validateImage = (file: File) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]

  if (!allowed.includes(file.type)) {
    return "Only JPG, PNG, WEBP allowed"
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must be less than 2MB"
  }

  return null
}

const validateVideo = (file: File) => {
  const allowed = [
    "video/mp4",
    "video/quicktime",
    "video/x-matroska",
  ]

  if (!allowed.includes(file.type)) {
    return "Only MP4, MOV, MKV allowed"
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return "Video size must be less than 200MB"
  }

  return null
}

const validatePdf = (file: File) => {
  if (file.type !== "application/pdf") {
    return "Only PDF allowed"
  }

  if (file.size > MAX_PDF_SIZE) {
    return "PDF size must be less than 10MB"
  }

  return null
}

/* =========================================================
   TYPES
========================================================= */

interface Category {
  _id:string
  name:string
}

interface Lesson {
  id:string

  backendId?:string

  title:string

  duration:string

  content:string

  videoFile?:File | null

  documentFile?:File | null

  isEditing?:boolean
}
interface QuizQuestion {
  id:string
  question:string
  options:string[]
  correctAnswer:string
}

interface Quiz {
  id:string

  title:string

  questions:QuizQuestion[]

  isEditing?:boolean
}

interface Module {
  id:string
  title:string

  lessons:Lesson[]

  quizzes:Quiz[]

  showLessonForm?:boolean

  showQuizForm?:boolean

  isEditing?:boolean
}



function CreateCourseForm() {

  const [step, setStep] =
    useState(1)

  const [loading, setLoading] =
    useState(false)

    const [
  thumbnailProgress,
  setThumbnailProgress,
] = useState(0)

const [
  promoVideoProgress,
  setPromoVideoProgress,
] = useState(0)

const [
  lessonVideoProgress,
  setLessonVideoProgress,
] = useState(0)

const [
  lessonPdfProgress,
  setLessonPdfProgress,
] = useState(0)

  const [courseId, setCourseId] =
    useState("")

  const [moduleTitle, setModuleTitle] =
    useState("")

  const [categories, setCategories] =
    useState<Category[]>([])

  const [modules, setModules] =
    useState<Module[]>([])



  /* =========================================================
     FORM DATA
  ========================================================= */

  const [formData, setFormData] =
    useState({
      title:"",
      subtitle:"",
      category:"",
      instructor:"",
      level:"Beginner",
      price:"",
      description:"",
      thumbnailImage:null as File | null,
      promotionalVideo:null as File | null,
    })



  /* =========================================================
     LESSON FORM
  ========================================================= */

  const [lessonForm, setLessonForm] =
    useState<Lesson>({
      id:"",
      title:"",
      duration:"",
      content:"",
      videoFile:null,
      documentFile:null,
    })



  /* =========================================================
     QUIZ FORM
  ========================================================= */

  const [quizForm, setQuizForm] =
    useState<Quiz>({
      id:"",
      title:"",
      questions:[
        {
          id:crypto.randomUUID(),
          question:"",
          options:["","","",""] ,
          correctAnswer:"",
        },
      ],
    })



  useEffect(()=>{

    setCategories([
      {
        _id:"1",
        name:"Development",
      },
      {
        _id:"2",
        name:"Design",
      },
      {
        _id:"3",
        name:"Artificial Intelligence",
      },
    ])

  }, [])



  /* =========================================================
     CREATE COURSE
  ========================================================= */

  const handleCreateCourse =
    async ()=>{
if (!formData.title.trim()) {
  toast.error("Course title required")
  return
}

if (!formData.subtitle.trim()) {
  toast.error("Subtitle required")
  return
}

if (!formData.category) {
  toast.error("Select category")
  return
}

if (!formData.instructor.trim()) {
  toast.error("Instructor required")
  return
}

if (!formData.price.trim()) {
  toast.error("Price required")
  return
}

if (!formData.description.trim()) {
  toast.error("Description required")
  return
}

if (!formData.thumbnailImage) {
  toast.error("Thumbnail required")
  return
}

if (!formData.promotionalVideo) {
  toast.error("Promotional video required")
  return
}
      try {

        setLoading(true)

        const form =
          new FormData()

        form.append(
          "courseName",
          formData.title
        )

        form.append(
          "courseDescription",
          formData.description
        )

        form.append(
          "category",
          formData.category
        )

        form.append(
          "price",
          formData.price
        )



        if (
          formData.thumbnailImage
        ) {

          form.append(
            "thumbnailImage",
            formData.thumbnailImage
          )
        }



        if (
          formData.promotionalVideo
        ) {

          form.append(
            "promotionalVideo",
            formData.promotionalVideo
          )
        }



        const res =
  await api.post(
    "/api/course/createCourse",
    form,
    {
      headers:{
        "Content-Type":
          "multipart/form-data",
      },

      onUploadProgress:(progressEvent)=>{

        const percent =
          Math.round(
            (
              progressEvent.loaded * 100
            ) /
            (progressEvent.total || 1)
          )



        if (
          formData.thumbnailImage
        ) {

          setThumbnailProgress(
            percent
          )
        }



        if (
          formData.promotionalVideo
        ) {

          setPromoVideoProgress(
            percent
          )
        }
      },
    }
  )



        setCourseId(
          res.data?.data?._id
        )

        setThumbnailProgress(100)

setPromoVideoProgress(100)

        toast.success(
          "Course Created"
        )

        setStep(2)

      } catch {

        toast.error(
          "Failed to create course"
        )

      } finally {

        setLoading(false)
      }
    }



  /* =========================================================
     ADD MODULE
  ========================================================= */

  const handleAddModule =
    async ()=>{

      if (!moduleTitle.trim()) {

        toast.error(
          "Enter module title"
        )

        return
      }

      try {

        const res =
          await api.post(
            "/api/course/addSection",
            {
              sectionName:
                moduleTitle,

              courseId,
            }
          )



        const latestSection =
          res.data
            ?.updatedCourse
            ?.courseContent
            ?.slice(-1)?.[0]



        setModules((prev)=>[
          ...prev,

          {
            id:
              latestSection?._id ||
              crypto.randomUUID(),

            title:
              moduleTitle,

            lessons:[],

            quizzes:[],

            showLessonForm:false,

            showQuizForm:false,
          },
        ])



        setModuleTitle("")

        toast.success(
          "Module Added"
        )

      } catch {

        toast.error(
          "Failed to add module"
        )
      }
    }



  /* =========================================================
     ADD LESSON
  ========================================================= */

const handleAddLesson =
  async (
    moduleId:string
  )=>{
if (!lessonForm.title.trim()) {
  toast.error("Lesson title required")
  return
}

if (!lessonForm.content.trim()) {
  toast.error("Lesson description required")
  return
}

if (!lessonForm.duration.trim()) {
  toast.error("Lesson duration required")
  return
}

if (!lessonForm.videoFile) {
  toast.error("Lesson video required")
  return
}

if (!lessonForm.documentFile) {
  toast.error("Lesson PDF required")
  return
}
    if (
      !lessonForm.title ||
      !lessonForm.duration
    ) {

      toast.error(
        "Fill all lesson fields"
      )

      return
    }

    try {

      const form =
        new FormData()

      form.append(
        "sectionId",
        moduleId
      )

      form.append(
        "title",
        lessonForm.title
      )

      form.append(
        "description",
        lessonForm.content
      )

      form.append(
        "timeDuration",
        lessonForm.duration
      )



      if (
        lessonForm.videoFile
      ) {

        form.append(
          "video",
          lessonForm.videoFile
        )
      }



      if (
        lessonForm.documentFile
      ) {

        form.append(
          "pdf",
          lessonForm.documentFile
        )
      }



     const res =
  await api.post(
    "/api/course/addSubSection",
    form,
    {
      headers:{
        "Content-Type":
          "multipart/form-data",
      },

      onUploadProgress:(progressEvent)=>{

        const percent =
          Math.round(
            (
              progressEvent.loaded * 100
            ) /
            (progressEvent.total || 1)
          )



        if (
          lessonForm.videoFile
        ) {

          setLessonVideoProgress(
            percent
          )
        }



        if (
          lessonForm.documentFile
        ) {

          setLessonPdfProgress(
            percent
          )
        }
      },
    }
  )



      console.log(
        "LESSON RESPONSE =>",
        res.data
      )



      const backendId =
        res.data?.data
          ?.subSection?.[0]
          ?._id



      console.log(
        "BACKEND ID =>",
        backendId
      )



      if (!backendId) {

        toast.error(
          "Backend lesson id missing"
        )

        return
      }



      const newLesson = {

        id:
          crypto.randomUUID(),

        backendId,

        title:
          lessonForm.title,

        duration:
          lessonForm.duration,

        content:
          lessonForm.content,

        videoFile:
          lessonForm.videoFile,

        documentFile:
          lessonForm.documentFile,
      }



      setModules((prev)=>
        prev.map((m)=>{

          if (
            m.id !== moduleId
          ) return m



          return {

            ...m,

            showLessonForm:false,

            lessons:[
              ...m.lessons,
              newLesson,
            ],
          }
        })
      )



      setLessonForm({
        id:"",
        title:"",
        duration:"",
        content:"",
        videoFile:null,
        documentFile:null,
      })



      toast.success(
        "Lesson Added"
      )

    } catch (error:any) {

      console.log(
        "LESSON ERROR =>",
        error
      )

      console.log(
        "LESSON ERROR RESPONSE =>",
        error?.response?.data
      )

      toast.error(
        "Failed to add lesson"
      )
    }
  }

  /* =========================================================
     ADD QUIZ
  ========================================================= */

const handleAddQuiz =
  async (
    moduleId:string
  )=>{

    try {

      const question =
        quizForm.questions[0]

      // VALIDATION

      if (!question.question.trim()) {

        toast.error(
          "Question required"
        )

        return
      }

      if (
        question.options.some(
          (op)=>!op.trim()
        )
      ) {

        toast.error(
          "All options required"
        )

        return
      }

      if (
        !question.correctAnswer.trim()
      ) {

        toast.error(
          "Select correct answer"
        )

        return
      }

      // MODULE

      const currentModule =
        modules.find(
          (m)=>m.id === moduleId
        )

      if (!currentModule) {

        toast.error(
          "Module not found"
        )

        return
      }

      // LESSON CHECK

      if (
        currentModule.lessons.length === 0
      ) {

        toast.error(
          "Please add lesson first"
        )

        return
      }

      const latestLesson =
        currentModule.lessons[
          currentModule.lessons.length - 1
        ]

      if (
        !latestLesson?.backendId
      ) {

        toast.error(
          "Lesson backendId missing"
        )

        return
      }

      // API

      await api.post(
        "/api/mcq/create",
        {
          question:
            question.question,

          options:
            JSON.stringify(
              question.options
            ),

          correctAnswer:
            question.options.indexOf(
              question.correctAnswer
            ),

          courseId,

          subsectionId:
            latestLesson.backendId,
        }
      )

      // STATE UPDATE

      setModules((prev)=>
        prev.map((m)=>
          m.id === moduleId
            ? {
                ...m,

                showQuizForm:false,

                quizzes:[
                  ...m.quizzes,

                  {
                    ...quizForm,

                    id:
                      crypto.randomUUID(),
                  },
                ],
              }
            : m
        )
      )

      // RESET

      setQuizForm({
        id:"",
        title:"",
        questions:[
          {
            id:crypto.randomUUID(),
            question:"",
            options:["","","",""],
            correctAnswer:"",
          },
        ],
      })

      toast.success(
        "Quiz Added"
      )

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to add quiz"
      )
    }
  }

  /* =========================================================
     PUBLISH COURSE
  ========================================================= */

  const handlePublishCourse =
    async ()=>{

      try {

        await api.post(
          "/api/course/publishCourse",
          {
            courseId,
          }
        )



        toast.success(
          "Course Published"
        )

        setStep(3)

      } catch {

        toast.error(
          "Failed to publish course"
        )
      }
    }



  /* =========================================================
     SUCCESS SCREEN
  ========================================================= */

  if (step === 3) {

    return (

     <Shell className={`bg-[#F7F8FC] min-h-screen`}>

        <div className="max-w-4xl mx-auto p-10 md:p-20">

          <div className="bg-white rounded-[30px] border p-16 text-center">

            <CheckCircle2
              size={90}
              className="mx-auto text-green-500"
            />

            <h1 className="text-[48px] font-bold mt-8">

              Course Published

            </h1>

            <p className="text-gray-500 mt-4">

              Your course is now live

            </p>

          </div>

        </div>

      </Shell>
    )
  }



  return (

    <Shell>

      <Toaster position="top-right" />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">

        {/* =========================================================
           STEP 1
        ========================================================= */}

        {step === 1 && (

          <div className=" bg-white rounded-[28px] border border-[#ECECF3] overflow-hidden shadow-[0_4px_40px_rgba(20,20,43,0.04)]">

            <div className="p-6 md:p-10 border-b">

              <h1 className="text-2xl font-bold tracking-tight">

                Create New Course

              </h1>

            </div>



            <div className="p-4 md:p-10">

              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">

                <input
                  className="premium-input"
                  placeholder="Course Title"

                  value={formData.title}

                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      title:e.target.value,
                    })
                  }
                />



                <input
                  className="premium-input"
                  placeholder="Subtitle"

                  value={formData.subtitle}

                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      subtitle:e.target.value,
                    })
                  }
                />

              </div>



              <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6">

                <select
                  className="premium-input"

                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      category:e.target.value,
                    })
                  }
                >

                  <option>
                    Select Category
                  </option>

                  {categories.map((category)=>(
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}

                </select>



                <input
                  className="premium-input"
                  placeholder="Instructor"

                  value={formData.instructor}

                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      instructor:e.target.value,
                    })
                  }
                />



                <input
                  className="premium-input"
                  placeholder="Price"

                  value={formData.price}

                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      price:e.target.value,
                    })
                  }
                />

              </div>



              <textarea
                rows={6}
                className="premium-textarea mt-6"
                placeholder="Course Description"

                value={formData.description}

                onChange={(e)=>
                  setFormData({
                    ...formData,
                    description:e.target.value,
                  })
                }
              />



              {/* UPLOADS */}

              <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mt-8">

                {/* THUMBNAIL */}

                <div>

                  <label className="upload-dropzone">

                    <UploadCloud
                      size={42}
                      className="text-[#5B50FF]"
                    />

                    <p className="mt-4 font-medium">
                      Upload Thumbnail
                    </p>

                    <input
                      hidden
                      type="file"
                      accept="image/*"

                      onChange={(e)=>
                        setFormData({
                          ...formData,
                          thumbnailImage:
                            e.target.files?.[0] || null,
                        })
                      }
                    />

                  </label>



                {formData.thumbnailImage && (

  <div className="
    mt-4
    border
    border-[#ECECF3]
    rounded-[16px]
    p-4
    bg-white
  ">

    <div className="
      flex
      items-center
      justify-between
      gap-4
    ">

      <div className="flex gap-3">

        <img
          src={URL.createObjectURL(
            formData.thumbnailImage
          )}
          className="
            w-[70px]
            h-[70px]
            rounded-[12px]
            object-cover
          "
        />

        <div>

          <p className="
            text-[14px]
            font-[600]
            text-[#161439]
          ">
            {formData.thumbnailImage.name}
          </p>

          <span className="
            text-[13px]
            text-[#8B8BA3]
          ">
            {thumbnailProgress}%
          </span>

        </div>

      </div>

      <CheckCircle2
        className="text-[#5B50FF]"
        size={22}
      />

    </div>

    <div className="
      h-[6px]
      rounded-full
      bg-[#ECECF3]
      mt-4
      overflow-hidden
    ">

      <div
        className="
          h-full
          bg-[#5B50FF]
          rounded-full
          transition-all
        "
        style={{
          width:
            `${thumbnailProgress}%`,
        }}
      />

    </div>

  </div>
)}
                </div>



                {/* VIDEO */}

                <div>

                  <label className="upload-dropzone">

                    <Video
                      size={42}
                      className="text-[#5B50FF]"
                    />

                    <p className="mt-4 font-medium">
                      Upload Promotional Video
                    </p>

                    <input
                      hidden
                      type="file"
                      accept="video/*"

                      onChange={(e) => {
  const file = e.target.files?.[0]

  if (!file) return

  const error = validateVideo(file)

  if (error) {
    toast.error(error)
    return
  }

  setFormData({
    ...formData,
    promotionalVideo: file,
  })
}}
                    />

                  </label>



                  {formData.promotionalVideo && (

  <div className="
    mt-4
    border
    border-[#ECECF3]
    rounded-[16px]
    p-4
    bg-white
  ">

    <div className="
      flex
      items-center
      justify-between
      gap-4
    ">

      <div className="flex gap-3">

        <div className="
          w-[70px]
          h-[70px]
          rounded-[12px]
          bg-[#F4F5FA]
          flex
          items-center
          justify-center
        ">

          <Video
            className="text-[#5B50FF]"
          />

        </div>

        <div>

          <p className="
            text-[14px]
            font-[600]
            text-[#161439]
          ">
            {formData.promotionalVideo.name}
          </p>

          <span className="
            text-[13px]
            text-[#8B8BA3]
          ">
            {promoVideoProgress}%
          </span>

        </div>

      </div>

      <CheckCircle2
        className="text-[#5B50FF]"
        size={22}
      />

    </div>

    <div className="
      h-[6px]
      rounded-full
      bg-[#ECECF3]
      mt-4
      overflow-hidden
    ">

      <div
        className="
          h-full
          bg-[#5B50FF]
          rounded-full
          transition-all
        "
        style={{
          width:
            `${promoVideoProgress}%`,
        }}
      />

    </div>

  </div>
)}

                </div>

              </div>



              <div className="flex justify-end mt-10">

                <button
                  onClick={handleCreateCourse}
                  className="primary-btn"
                >

                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save & Continue"
                  )}

                </button>

              </div>

            </div>

          </div>
        )}



        {/* =========================================================
           STEP 2
        ========================================================= */}

        {step === 2 && (

          <div className="bg-white rounded-[30px] border overflow-hidden">

            <div className="p-6 md:p-10 border-b">

              <div className="flex md:flex-row flex-col gap-5 md:items-center justify-between">

                <div>

                  <h1 className="text-[18px]
md:text-[24px]
 font-[600]
 text-[#161439]
 tracking-[-0.5px]">

                    Course Curriculum

                  </h1>

                </div>



                <div className="flex md:flex-row flex-col gap-4">

                  <input
                    value={moduleTitle}

                    onChange={(e)=>
                      setModuleTitle(
                        e.target.value
                      )
                    }

                    placeholder="Module Title"

                    className="premium-input md:w-[320px]"
                  />



                  <button
                    onClick={handleAddModule}
                    className="primary-btn"
                  >

                    + Add Module

                  </button>

                </div>

              </div>

            </div>



            <div className="p-4 md:p-10 space-y-6">

              {modules.map((module, moduleIndex)=>(

                <div
                  key={module.id}
                  className="
 bg-white
 border
 border-[#ECECF3]
 rounded-[20px]
 p-5
 md:p-7
 shadow-sm
"
                >

                  {/* MODULE HEADER */}

                  <div className="flex md:flex-row flex-col gap-5 justify-between mb-6">

                   {module.isEditing ? (

  <input
    value={module.title}

    onChange={(e)=>
      setModules((prev)=>
        prev.map((m)=>
          m.id === module.id
            ? {
                ...m,
                title:e.target.value,
              }
            : m
        )
      )
    }

    className="premium-input max-w-[350px]"
  />

) : (

  <h2 className="
    text-[18px]
    font-[700]
    text-[#161439]
    flex
    items-center
    gap-3
  ">

    Module {moduleIndex + 1}
    :
    {" "}
    {module.title}

  </h2>
)}


                    <div className="flex flex-wrap gap-4">
                    <button
                    onClick={()=>
                      setModules((prev)=>
                        prev.map((m)=>
                          m.id === module.id
                            ? {
                                ...m,
                                isEditing:!m.isEditing,
                              }
                            : m
                        )
                      )
                    }
                    className="outline-btn"
                  >

                    Edit

                  </button>
                      <button
                        onClick={()=>
                          setModules((prev)=>
                            prev.map((m)=>
                              m.id === module.id
                                ? {
                                    ...m,
                                    showLessonForm:true,
                                  }
                                : m
                            )
                          )
                        }
                        className="outline-btn"
                      >

                        + Add Lesson

                      </button>



                      <button
                        onClick={()=>
                          setModules((prev)=>
                            prev.map((m)=>
                              m.id === module.id
                                ? {
                                    ...m,
                                    showQuizForm:true,
                                  }
                                : m
                            )
                          )
                        }
                        className="outline-btn"
                      >

                        + Add Quiz

                      </button>



                      <button
                        onClick={()=>
                          setModules((prev)=>
                            prev.filter(
                              (m)=>m.id !== module.id
                            )
                          )
                        }
                        className="text-red-500"
                      >

                        <Trash2 size={20} />

                      </button>

                    </div>

                  </div>



                  {/* LESSON FORM */}

                  {module.showLessonForm && (

                    <div className="border rounded-[20px] p-6 mb-6">

                      <input
                        placeholder="Lesson Title"

                        className="premium-input mb-5"

                        value={lessonForm.title}

                        onChange={(e)=>
                          setLessonForm({
                            ...lessonForm,
                            title:e.target.value,
                          })
                        }
                      />



                      <textarea
                        rows={5}

                        placeholder="Description"

                        className="premium-textarea mb-5"

                        value={lessonForm.content}

                        onChange={(e)=>
                          setLessonForm({
                            ...lessonForm,
                            content:e.target.value,
                          })
                        }
                      />



                      <input
                        placeholder="Duration"

                        className="premium-input mb-5"

                        value={lessonForm.duration}

                        onChange={(e)=>
                          setLessonForm({
                            ...lessonForm,
                            duration:e.target.value,
                          })
                        }
                      />



                     <div className="grid md:grid-cols-2 grid-cols-1 gap-5">

  {/* VIDEO UPLOAD */}

  <label className="
    border-2
    border-dashed
    border-[#D9DBE9]
    rounded-[18px]
    h-[180px]
    flex
    flex-col
    items-center
    justify-center
    cursor-pointer
    bg-[#FCFCFF]
    hover:border-[#5B50FF]
    transition-all
  ">

    <Video
      size={38}
      className="text-[#5B50FF]"
    />

    <p className="
      mt-4
      text-[15px]
      font-[600]
      text-[#161439]
    ">
      Upload Lesson Video
    </p>

    <span className="
      text-[13px]
      text-[#8B8BA3]
      mt-1
    ">
      MP4, MOV
    </span>

    <input
      hidden
      type="file"
      accept="video/*"

      onChange={(e) => {
  const file = e.target.files?.[0]

  if (!file) return

  const error = validateVideo(file)

  if (error) {
    toast.error(error)
    return
  }

  setLessonForm({
    ...lessonForm,
    videoFile: file,
  })
}}
    />

  </label>



  {/* PDF UPLOAD */}

  <label className="
    border-2
    border-dashed
    border-[#D9DBE9]
    rounded-[18px]
    h-[180px]
    flex
    flex-col
    items-center
    justify-center
    cursor-pointer
    bg-[#FCFCFF]
    hover:border-[#5B50FF]
    transition-all
  ">

    <UploadCloud
      size={38}
      className="text-[#5B50FF]"
    />

    <p className="
      mt-4
      text-[15px]
      font-[600]
      text-[#161439]
    ">
      Upload PDF Notes
    </p>

    <span className="
      text-[13px]
      text-[#8B8BA3]
      mt-1
    ">
      PDF Documents
    </span>

    <input
      hidden
      type="file"
      accept=".pdf"

      onChange={(e)=>
        setLessonForm({
          ...lessonForm,

          documentFile:
            e.target.files?.[0] || null,
        })
      }
    />

  </label>



  {/* VIDEO PREVIEW */}

  {lessonForm.videoFile && (

    <div className="
      border
      border-[#ECECF3]
      rounded-[16px]
      p-4
      bg-white
      md:col-span-1
    ">

      <div className="
        flex
        items-center
        justify-between
        gap-4
      ">

        <div className="flex gap-3">

          <div className="
            w-[60px]
            h-[60px]
            rounded-[12px]
            bg-[#F5F6FF]
            flex
            items-center
            justify-center
          ">

            <Video
              className="text-[#5B50FF]"
              size={22}
            />

          </div>

          <div>

            <p className="
              text-[14px]
              font-[600]
              text-[#161439]
            ">
              {lessonForm.videoFile.name}
            </p>

            <span className="
              text-[13px]
              text-[#8B8BA3]
            ">
              {lessonVideoProgress}%
            </span>

          </div>

        </div>

        <CheckCircle2
          size={22}
          className="text-[#5B50FF]"
        />

      </div>

      <div className="
        h-[6px]
        rounded-full
        bg-[#ECECF3]
        mt-4
        overflow-hidden
      ">

        <div
          className="
            h-full
            bg-[#5B50FF]
            transition-all
            rounded-full
          "
          style={{
            width:
              `${lessonVideoProgress}%`,
          }}
        />

      </div>

    </div>
  )}



  {/* PDF PREVIEW */}

  {lessonForm.documentFile && (

    <div className="
      border
      border-[#ECECF3]
      rounded-[16px]
      p-4
      bg-white
      md:col-span-1
    ">

      <div className="
        flex
        items-center
        justify-between
        gap-4
      ">

        <div className="flex gap-3">

          <div className="
            w-[60px]
            h-[60px]
            rounded-[12px]
            bg-[#FFF4F4]
            flex
            items-center
            justify-center
            text-red-500
            font-bold
          ">

            PDF

          </div>

          <div>

            <p className="
              text-[14px]
              font-[600]
              text-[#161439]
            ">
              {lessonForm.documentFile.name}
            </p>

            <span className="
              text-[13px]
              text-[#8B8BA3]
            ">
              {lessonPdfProgress}%
            </span>

          </div>

        </div>

        <CheckCircle2
          size={22}
          className="text-[#5B50FF]"
        />

      </div>

      <div className="
        h-[6px]
        rounded-full
        bg-[#ECECF3]
        mt-4
        overflow-hidden
      ">

        <div
          className="
            h-full
            bg-[#5B50FF]
            transition-all
            rounded-full
          "
          style={{
            width:
              `${lessonPdfProgress}%`,
          }}
        />

      </div>

    </div>
  )}

</div>



                      <button
                        onClick={()=>
                          handleAddLesson(
                            module.id
                          )
                        }
                        className="primary-btn mt-6"
                      >

                        Save Lesson

                      </button>

                    </div>
                  )}



                  {/* LESSON LIST */}

                  <div className="space-y-4">

                    {module.lessons.map((lesson, index)=>(

                      <div
                        key={lesson.id}
                        className="
 min-h-[72px]
 border
 border-[#ECECF3]
 rounded-[16px]
 px-5
 py-4
 flex
 items-center
 justify-between
 bg-white
 hover:border-[#5B50FF]
 transition-all
"
                      >

                        <div>

                          <div className="flex items-center gap-3">

                            <span className="font-[600] text-[14px]">

                              Lesson {index + 1} :

                            </span>

                           {lesson.isEditing ? (

  <input
    value={lesson.title}

    onChange={(e)=>
      setModules((prev)=>
        prev.map((m)=>
          m.id === module.id
            ? {
                ...m,

                lessons:
                  m.lessons.map((l)=>
                    l.id === lesson.id
                      ? {
                          ...l,
                          title:e.target.value,
                        }
                      : l
                  ),
              }
            : m
        )
      )
    }

    className="premium-input h-[42px] w-[260px]"
  />

) : (

  <span>
    {lesson.title}
  </span>
)}

                          </div>



                          {lesson.videoFile && (

                            <span className="text-xs text-[#5B50FF] mt-1 block">

                              Video Added

                            </span>
                          )}

                        </div>



                        <button
                          onClick={()=>
                            setModules((prev)=>
                              prev.map((m)=>
                                m.id === module.id
                                  ? {
                                      ...m,

                                      lessons:
                                        m.lessons.filter(
                                          (l)=>
                                            l.id !== lesson.id
                                        ),
                                    }
                                  : m
                              )
                            )
                          }
                          className="text-red-500"
                        >
                            <button
  onClick={()=>
    setModules((prev)=>
      prev.map((m)=>
        m.id === module.id
          ? {
              ...m,

              lessons:
                m.lessons.map((l)=>
                  l.id === lesson.id
                    ? {
                        ...l,
                        isEditing:
                          !l.isEditing,
                      }
                    : l
                ),
            }
          : m
      )
    )
  }
  className="text-[#5B50FF]"
>

  Edit

</button>
                          <Trash2 size={18} />

                        </button>

                      </div>
                    ))}

                  </div>



                  {/* QUIZ FORM */}

                  {module.showQuizForm && (

                   <div className="
 mt-6
 border
 border-[#ECECF3]
 rounded-[18px]
 p-5
 bg-[#FCFCFF]
">

                      <input
                        placeholder="Quiz Question"

                        className="premium-input mb-5"

                        value={
                          quizForm.questions[0].question
                        }

                        onChange={(e)=>
                          setQuizForm({
                            ...quizForm,

                            title:e.target.value,

                            questions:[
                              {
                                ...quizForm.questions[0],
                                question:e.target.value,
                              },
                            ],
                          })
                        }
                      />



                      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">

                        {quizForm.questions[0]
                          .options.map(
                            (option, index)=>(

                              <div
                                key={index}
                                className="
 flex
 items-center
 gap-3
 bg-white
 border
 border-[#ECECF3]
 rounded-[12px]
 px-4
 h-[56px]
"
                              >

                                <button
                                  type="button"

                                  onClick={()=>
                                    setQuizForm({
                                      ...quizForm,

                                      questions:[
                                        {
                                          ...quizForm.questions[0],

                                          correctAnswer:
                                            quizForm.questions[0]
                                              .options[index],
                                        },
                                      ],
                                    })
                                  }
                                  className={`w-5 h-5 rounded-full border ${
                                    quizForm.questions[0]
                                      .correctAnswer === option
                                      ? "bg-[#5B50FF] border-[#5B50FF]"
                                      : "border-gray-300"
                                  }`}
                                />



                                <input
                                  className="premium-input"

                                  placeholder={`Option ${index + 1}`}

                                  value={option}

                                  onChange={(e)=>
                                    setQuizForm({
                                      ...quizForm,

                                      questions:[
                                        {
                                          ...quizForm.questions[0],

                                          options:
                                            quizForm.questions[0]
                                              .options.map(
                                                (op, i)=>
                                                  i === index
                                                    ? e.target.value
                                                    : op
                                              ),
                                        },
                                      ],
                                    })
                                  }
                                />

                              </div>
                            )
                          )}

                      </div>



                      <button
                       onClick={()=>
                        handleAddQuiz(
                          module.id
                        )
                      }
                        className="primary-btn mt-6"
                      >

                        Save Quiz

                      </button>

                    </div>
                  )}



                  {/* QUIZ LIST */}

                  <div className="space-y-4 mt-6">

                    {module.quizzes.map((quiz, index)=>(

                      <div
                        key={quiz.id}
                       className="
 min-h-[68px]
 border
 border-[#ECECF3]
 rounded-[14px]
 px-5
 py-4
 flex
 items-center
 justify-between
 bg-white
 hover:border-[#5B50FF]
 transition
"
                      >

                        <div className="flex items-center gap-3">

                          <span className="font-semibold">

                           Question {index + 1}

                          </span>

                         {quiz.isEditing ? (

  <input
    value={
      quiz.questions[0]
        .question
    }

    onChange={(e)=>
      setModules((prev)=>
        prev.map((m)=>
          m.id === module.id
            ? {
                ...m,

                quizzes:
                  m.quizzes.map((q)=>
                    q.id === quiz.id
                      ? {
                          ...q,

                          questions:[
                            {
                              ...q.questions[0],

                              question:
                                e.target.value,
                            },
                          ],
                        }
                      : q
                  ),
              }
            : m
        )
      )
    }

    className="premium-input h-[42px] w-[350px]"
  />

) : (

  <span>
    {
      quiz.questions[0]
        .question
    }
  </span>
)}

                        </div>

<button
  onClick={()=>
    setModules((prev)=>
      prev.map((m)=>
        m.id === module.id
          ? {
              ...m,

              quizzes:
                m.quizzes.map((q)=>
                  q.id === quiz.id
                    ? {
                        ...q,
                        isEditing:
                          !q.isEditing,
                      }
                    : q
                ),
            }
          : m
      )
    )
  }
  className="text-[#5B50FF]"
>

  Edit

</button>

                        <button
                          onClick={()=>
                            setModules((prev)=>
                              prev.map((m)=>
                                m.id === module.id
                                  ? {
                                      ...m,

                                      quizzes:
                                        m.quizzes.filter(
                                          (q)=>
                                            q.id !== quiz.id
                                        ),
                                    }
                                  : m
                              )
                            )
                          }
                          className="text-red-500"
                        >

                          <Trash2 size={18} />

                        </button>

                      </div>
                    ))}

                  </div>

                </div>
              ))}

            </div>



            {/* FOOTER */}

            <div className="p-6 md:p-10 border-t flex justify-end">

              <button
                onClick={handlePublishCourse}
                className="primary-btn"
              >

                Publish Course

              </button>

            </div>

          </div>
        )}

      </div>

    </Shell>
  )
}

export default CreateCourseForm

