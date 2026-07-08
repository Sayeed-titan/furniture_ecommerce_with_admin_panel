import { ArrowUp, ArrowDown, Trash2, Star } from "lucide-react";
import { addProductImage, removeProductImage, moveProductImage } from "@/lib/actions/product-images";
import { ImageUrlUploader } from "@/components/admin/image-url-uploader";

type Image = { id: string; url: string; position: number };

/**
 * Full gallery manager for the product edit page. Lists existing images
 * (first one = primary/homepage image), lets you reorder, remove, and add
 * new ones. Backed by server actions in lib/actions/product-images.ts.
 */
export function ProductGallery({ productId, images }: { productId: string; images: Image[] }) {
  const addAction = addProductImage.bind(null, productId);

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, i) => (
            <li key={img.id} className="group relative overflow-hidden rounded-lg border border-neutral-200">
              <div className="relative aspect-square bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary URL */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
                    <Star className="h-3 w-3 fill-white" /> Primary
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-neutral-200 bg-white px-2 py-1.5">
                <div className="flex gap-1">
                  <form action={moveProductImage}>
                    <input type="hidden" name="imageId" value={img.id} />
                    <input type="hidden" name="productId" value={productId} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label="Move up"
                      className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                  </form>
                  <form action={moveProductImage}>
                    <input type="hidden" name="imageId" value={img.id} />
                    <input type="hidden" name="productId" value={productId} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={i === images.length - 1}
                      aria-label="Move down"
                      className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
                <form action={removeProductImage}>
                  <input type="hidden" name="imageId" value={img.id} />
                  <input type="hidden" name="productId" value={productId} />
                  <button
                    type="submit"
                    aria-label="Remove image"
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
          No images yet. Add the first one below — it becomes the primary image.
        </p>
      )}

      <form action={addAction} className="border-t border-neutral-200 pt-4">
        <ImageUrlUploader />
      </form>
    </div>
  );
}
