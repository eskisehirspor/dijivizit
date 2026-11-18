"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createProductAction,
  deleteProductAction,
  toggleProductVisibilityAction,
} from "@/app/actions/profile-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AVATAR_MIME_TYPES } from "@/lib/profile/avatar";
import { uploadOwnImage } from "@/lib/profile/upload-image";

export type ProductListItem = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  url: string | null;
  imageUrl: string | null;
  isVisible: boolean;
};

export function ProductsManager({ products, max }: { products: ProductListItem[]; max: number }) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-8">
      {products.length < max ? (
        <ProductForm />
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("profile.products.limitReached", { max })}
        </p>
      )}
      {products.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {products.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{t("profile.products.empty")}</p>
      )}
    </div>
  );
}

function ProductForm() {
  const t = useTranslations();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    start(async () => {
      let imagePath = "";
      if (file) {
        const uploaded = await uploadOwnImage(file);
        if (!uploaded.ok) {
          toast.error(t(uploaded.code));
          return;
        }
        imagePath = uploaded.path;
      }
      const result = await createProductAction({
        title: String(data.get("title") ?? ""),
        description: String(data.get("description") ?? ""),
        price: String(data.get("price") ?? ""),
        url: String(data.get("url") ?? ""),
        imagePath,
      });
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(t(result.code));
        return;
      }
      setErrors({});
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      formRef.current?.reset();
      router.refresh();
      toast.success(t("profile.products.added"));
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col gap-5 rounded-lg border border-border/60 p-6"
    >
      <h2 className="text-sm font-medium">{t("profile.products.addTitle")}</h2>
      <Field id="product-title" label={t("profile.products.fields.title")} error={errors.title}>
        <Input id="product-title" name="title" maxLength={80} required />
      </Field>
      <Field
        id="product-description"
        label={t("profile.products.fields.description")}
        error={errors.description}
      >
        <Textarea id="product-description" name="description" maxLength={300} rows={3} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="product-price" label={t("profile.products.fields.price")} error={errors.price}>
          <Input
            id="product-price"
            name="price"
            maxLength={40}
            placeholder={t("profile.products.fields.pricePlaceholder")}
          />
        </Field>
        <Field id="product-url" label={t("profile.products.fields.url")} error={errors.url}>
          <Input
            id="product-url"
            name="url"
            inputMode="url"
            maxLength={500}
            placeholder="https://"
          />
        </Field>
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={fileRef}
          id="product-image"
          type="file"
          accept={AVATAR_MIME_TYPES.join(",")}
          className="sr-only"
          onChange={onFile}
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 w-fit gap-2"
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus aria-hidden="true" className="size-4" />
          {file ? file.name : t("profile.products.fields.image")}
        </Button>
        <p className="text-xs text-muted-foreground">{t("profile.avatar.hint")}</p>
      </div>
      <Button type="submit" className="h-10 w-fit" disabled={pending}>
        {pending ? t("common.loading") : t("profile.products.add")}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{t(error)}</p> : null}
    </div>
  );
}

function ProductRow({ product }: { product: ProductListItem }) {
  const t = useTranslations();
  const router = useRouter();
  const [visible, setVisible] = useState(product.isVisible);
  const [pending, start] = useTransition();

  function toggle(next: boolean) {
    setVisible(next);
    start(async () => {
      const result = await toggleProductVisibilityAction(product.id, next);
      if (!result.ok) {
        setVisible(!next);
        toast.error(t(result.code));
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(t("profile.products.deleteConfirm", { title: product.title }))) return;
    start(async () => {
      const result = await deleteProductAction(product.id);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      router.refresh();
      toast.success(t("profile.products.deleted"));
    });
  }

  return (
    <li className="flex items-center gap-4 rounded-lg border border-border/60 p-3">
      <div className="size-14 shrink-0 overflow-hidden rounded-md bg-muted">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote storage URL
          <img src={product.imageUrl} alt="" className="size-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {[product.price, product.url].filter(Boolean).join(" · ")}
        </p>
      </div>
      <Switch
        checked={visible}
        disabled={pending}
        onCheckedChange={toggle}
        aria-label={t("profile.products.visible")}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={remove}
        aria-label={t("profile.products.delete")}
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </Button>
    </li>
  );
}
