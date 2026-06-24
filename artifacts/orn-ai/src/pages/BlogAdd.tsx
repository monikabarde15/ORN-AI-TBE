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
import { useAuth } from "@/hooks/use-auth";

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
  Eye,
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
  const { user } = useAuth();

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    api
      .get(`/api/user-permissions/${user.id}`)
      .then((res) => {
        setPermissions(res.data.permissions || []);
      });
  }, [user?.id]);

  const hasPermission = (
    moduleName: string,
    action = "canView"
  ) => {
    if (user?.role === "admin") return true;

    return permissions.some(
      (p: any) =>
        p.moduleName === moduleName &&
        p[action]
    );
  };


  console.log(user);
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
  const [previewOpen, setPreviewOpen] = useState(false);

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
      <div className="px-8 py-6">
        <div
          className="
    flex
    flex-col
    md:flex-row
    gap-4
    md:items-center
    md:justify-between
    mb-8
  "
        >
            <h3 className="text-3xl font-semibold tracking-tight">
              Blog Management
            </h3>

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

              {hasPermission("Blogs", "canAdd") && (
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Blog
                </Button>
              )}
            </div>
          </div>

          <div>
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
                          className="h-20 w-36 rounded-xl object-cover border shadow-sm"
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
                          {hasPermission("Blogs", "canEdit") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(blog)}
                            >
                              <Pencil size={14} />
                            </Button>
                          )}

                          {hasPermission("Blogs", "canDelete") && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(blog.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
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
          </div>

        {/* Blog Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className=" w-[98vw] h-[95vh] max-w-[1600px] overflow-hidden rounded-3xl border-0 shadow-2xl p-0"
          >
            <DialogHeader>
              <div className="px-6 py-3 border-b bg-background flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {editingBlog ? "Edit Blog" : "Create Blog"}
                </h2>
              </div>
            </DialogHeader>

            <div className="
  flex-1
  min-h-0
  grid
  grid-cols-1
  lg:grid-cols-[340px_1fr]

  overflow-hidden"
            >
              {/* Left Panel */}
              <div className="border-r bg-muted/10 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-8 hide-scrollbar">

                  {/* BLOG DETAILS */}

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Blog Details
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Blog Title
                      </label>

                      <Input
                        placeholder="Enter blog title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Category
                      </label>

                      <Input
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* THUMBNAIL */}

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Thumbnail
                    </h3>

                    <label className="border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                      <div className="text-center">
                        <p className="font-medium">
                          Upload Thumbnail
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WEBP
                        </p>
                      </div>

                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          setImage(file);
                          setImagePreview(URL.createObjectURL(file));
                        }}
                      />
                    </label>

                    {imagePreview && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Preview
                        </p>

                        <img
                          src={imagePreview}
                          className="w-full h-48 object-cover rounded-xl border"
                        />
                      </div>
                    )}
                  </div>

                </div>

                <div className="border-t bg-background p-4 shrink-0">
                  <Button
                    className="w-full h-11 rounded-xl"
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

              </div>

              <div className="flex flex-col h-full overflow-hidden">

                <div className="h-full flex flex-col overflow-hidden bg-muted/20 border-l">

                  {/* ToolBar */}
                  <div
                    className="
    sticky
    top-0
    z-20
    bg-background
    border-b
    px-3
    py-2
    flex
    items-center
    justify-between
    shrink-0
  "
                  >
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="
                        h-9
                        w-9
                        p-0
                        rounded-lg
                      "
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
                        className="
    h-9
    w-9
    p-0
    rounded-lg
  "
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
                        className="
    h-9
    w-9
    p-0
    rounded-lg
  "
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
                        className="
    h-9
    w-9
    p-0
    rounded-lg
  "
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
                        className="
    h-9
    w-9
    p-0
    rounded-lg
  "
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
                        className="
    h-9
    w-9
    p-0
    rounded-lg
  "
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

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 bg-blue-800 text-white"
                        onClick={() => setPreviewOpen(true)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
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

    px-8
    py-8

    prose
    max-w-none

    [&_.ProseMirror]:max-w-4xl
    [&_.ProseMirror]:mx-auto

    [&_.ProseMirror]:min-h-[600px]

    [&_.ProseMirror]:bg-background
    [&_.ProseMirror]:rounded-2xl
    [&_.ProseMirror]:border

    [&_.ProseMirror]:p-10

    [&_.ProseMirror]:shadow-sm

    [&_.ProseMirror]:outline-none
  "
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}

        <Dialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        >
          <DialogContent className="max-w-7xl h-[90vh] overflow-hidden p-0">
            <div className="h-full min-h-0 flex flex-col">

              <div className="shrink-0 border-b px-6 py-3 bg-background">
                <h2 className="font-semibold">
                  Blog Preview
                </h2>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-[320px] object-cover"
                  />
                )}

                <div className="max-w-4xl mx-auto px-8 py-10">

                  {category && (
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">
                      {category}
                    </p>
                  )}

                  <h1 className="text-4xl font-bold mb-8">
                    {title || "Untitled Blog"}
                  </h1>

                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  />
                </div>

              </div>

            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
}