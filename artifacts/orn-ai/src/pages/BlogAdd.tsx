import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import { Shell } from "@/components/layout/Shell";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Blog {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  status: string;
}

export default function BlogManagementNew() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 5;

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/blogs");
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setEditingBlog(null);
    editor?.commands.setContent("");
  };

  const handleAdd = () => {
    resetForm();
    setOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);

    setTitle(blog.title);
    setCategory(blog.category);
    setDescription(blog.description);

    setImagePreview(blog.thumbnail || "");

    editor?.commands.setContent(blog.description || "");

    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("status", "Published");

      if (image) {
        formData.append("thumbnailImage", image);
      }

      if (editingBlog) {
        await api.put(
          `/api/blogs/${editingBlog.id}`,
          formData
        );
      } else {
        await api.post(
          "/api/blog/create",
          formData
        );
      }

      await fetchBlogs();

      setOpen(false);

      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [blogs, search]);

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredBlogs.slice(
      start,
      start + perPage
    );
  }, [filteredBlogs, page]);

  const totalPages = Math.ceil(
    filteredBlogs.length / perPage
  );

  return (
    <Shell>
      <div className="p-4 md:p-8">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <CardTitle className="text-2xl font-bold">
              Blog Management
            </CardTitle>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4" />
                <Input
                  className="pl-10 w-full md:w-[250px]"
                  placeholder="Search Blog..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Blog
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <img
                          src={
                            blog.thumbnail ||
                            "https://placehold.co/120x80"
                          }
                          className="h-16 w-28 rounded-lg object-cover"
                        />
                      </TableCell>

                      <TableCell>
                        {blog.title}
                      </TableCell>

                      <TableCell>
                        {blog.category}
                      </TableCell>

                      <TableCell>
                        {blog.status}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleEdit(blog)
                            }
                          >
                            <Pencil size={14} />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDelete(blog.id)
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() =>
                  setPage(page - 1)
                }
              >
                Prev
              </Button>

              <span className="px-4 py-2">
                {page} / {totalPages || 1}
              </span>

              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage(page + 1)
                }
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
  className="
    w-[98vw]
    h-[95vh]

    max-w-7xl

    overflow-hidden

    rounded-3xl

    p-0
  "
>
            <DialogHeader>
              <DialogTitle>
                {editingBlog
                  ? "Edit Blog"
                  : "Create Blog"}
              </DialogTitle>
            </DialogHeader>

            <div className=" grid
    grid-cols-1

    lg:grid-cols-[420px_1fr]

    h-[calc(95vh-80px)]

    overflow-hidden">
              <div className="border-r

    overflow-y-auto

    p-5

    space-y-5">
                <Input
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

                <Input
                  placeholder="Category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                />

                
<label
  className="
    border-2
    border-dashed
    rounded-2xl

    h-40

    flex
    items-center
    justify-center

    cursor-pointer

    hover:bg-muted
  "
>
  Upload Thumbnail

  <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (!file) return;

                    setImage(file);

                    setImagePreview(
                      URL.createObjectURL(file)
                    );
                  }}
                />
</label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    className="
                      w-full
                      h-40
                      sm:h-56
                      md:h-64
                      object-cover
                      rounded-xl
                      border
                    "
                  />
                )}

                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={handleSave}
                >
                  {loading
                    ? "Saving..."
                    : editingBlog
                    ? "Update Blog"
                    : "Create Blog"}
                </Button>
              </div>

              <div className="flex
    flex-col

    h-full

    overflow-hidden">
                <div className=" border
    rounded-xl

    overflow-hidden

    h-full

    flex
    flex-col">
                  <div className="sticky
    top-0

    z-20

    bg-background

    border-b

    p-3

    flex
    flex-wrap

    gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleBold()
                          .run()
                      }
                    >
                      <Bold size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleItalic()
                          .run()
                      }
                    >
                      <Italic size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleBulletList()
                          .run()
                      }
                    >
                      <List size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleOrderedList()
                          .run()
                      }
                    >
                      <ListOrdered size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .undo()
                          .run()
                      }
                    >
                      <Undo2 size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .redo()
                          .run()
                      }
                    >
                      <Redo2 size={14} />
                    </Button>
                  </div>

                <div
  className="
    flex
    flex-col
    h-full
    overflow-hidden
  "
>
  

  <EditorContent
    editor={editor}
    className="
      flex-1
      overflow-y-auto
      p-6
      prose
      max-w-none

      [&_.ProseMirror]:outline-none
      [&_.ProseMirror]:min-h-full
    "
  />
</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
}