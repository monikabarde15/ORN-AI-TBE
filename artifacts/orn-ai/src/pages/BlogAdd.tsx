import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
} from "lucide-react";

import {
  useEditor,
  EditorContent,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

interface Blog {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  status: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] =
    useState<Blog[]>([]);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [editingBlog, setEditingBlog] =
    useState<Blog | null>(null);

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const perPage = 5;

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,

    onUpdate: ({ editor }) => {
      setDescription(
        editor.getHTML()
      );
    },
  });

  const fetchBlogs = async () => {
    try {
      const res =
        await api.get("/api/blogs");

      setBlogs(
        res.data.data || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs =
    blogs.filter((blog) =>
      blog.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const paginatedBlogs =
    useMemo(() => {
      const start =
        (page - 1) * perPage;

      return filteredBlogs.slice(
        start,
        start + perPage
      );
    }, [filteredBlogs, page]);

  const totalPages =
    Math.ceil(
      filteredBlogs.length /
        perPage
    );

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setEditingBlog(null);

    editor?.commands.setContent("");
  };

  const handleAddClick = () => {
    resetForm();
    setOpen(true);
  };

  const handleEditClick = (
    blog: Blog
  ) => {
    setEditingBlog(blog);

    setTitle(blog.title);

    setCategory(
      blog.category
    );

    setDescription(
      blog.description
    );

    setImagePreview(
      blog.thumbnail || ""
    );

    editor?.commands.setContent(
      blog.description || ""
    );

    setOpen(true);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleDelete = async (
    id: string
  ) => {
    try {
      await api.delete(
        `/api/blogs/${id}`
      );

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "status",
        "Published"
      );

      if (image) {
        formData.append(
          "thumbnailImage",
          image
        );
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Blog CMS
            </CardTitle>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4" />

                <Input
                  className="pl-10"
                  placeholder="Search"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>

              <Button
                onClick={
                  handleAddClick
                }
              >
                <Plus
                  size={16}
                />
                Add Blog
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Image
                  </TableHead>

                  <TableHead>
                    Title
                  </TableHead>

                  <TableHead>
                    Category
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedBlogs.map(
                  (blog) => (
                    <TableRow
                      key={blog.id}
                    >
                      <TableCell>
                        <img
                          src={
                            blog.thumbnail ||
                            "https://placehold.co/100x60"
                          }
                          className="h-14 w-24 rounded object-cover"
                        />
                      </TableCell>

                      <TableCell>
                        {
                          blog.title
                        }
                      </TableCell>

                      <TableCell>
                        {
                          blog.category
                        }
                      </TableCell>

                      <TableCell>
                        {
                          blog.status
                        }
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleEditClick(
                                blog
                              )
                            }
                          >
                            <Pencil size={14} />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDelete(
                                blog.id
                              )
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>
                {editingBlog
                  ? "Edit Blog"
                  : "Add Blog"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Category"
                  value={
                    category
                  }
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />

                {imagePreview && (
                  <img
                    src={
                      imagePreview
                    }
                    className="w-full h-64 object-cover rounded"
                  />
                )}

                <Button
                  className="w-full"
                  onClick={
                    handleSave
                  }
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? "Saving..."
                    : editingBlog
                    ? "Update Blog"
                    : "Create Blog"}
                </Button>
              </div>

              <div>
                <EditorContent
                  editor={editor}
                  className="min-h-[500px] border rounded p-4"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
}