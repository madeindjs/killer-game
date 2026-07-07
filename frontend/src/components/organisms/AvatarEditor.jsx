"use client";
// https://github.com/dapi-labs/react-nice-avatar/blob/730bbb33fb7f89199b92c3ffb5dd5aef317f81c8/demo/src/App/AvatarEditor/index.tsx

import { useTranslations } from "next-intl";
import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "../atoms/Loader";

const Avatar = dynamic(
  () => import("react-nice-avatar").then((mod) => mod.default),
  { ssr: false }
);

/** @typedef {import("react-nice-avatar").AvatarConfig} AvatarConfig */

/**
 * @typedef {Object} AvatarEditorProps
 * @property {AvatarConfig} config
 * @property {(config: AvatarConfig) => void} onUpdate
 * @property {string} [playerId]
 * @property {string} [authToken]
 * @property {boolean} [hasCustomImage]
 */

/**
 *
 * @param {AvatarConfig} config
 * @returns {(field: ) => AvatarConfig}
 */
function useConfigChanger(config) {
  /**
   * Default value of avatar stolen [here](https://github.com/dapi-labs/react-nice-avatar/blob/730bbb33fb7f89199b92c3ffb5dd5aef317f81c8/src/utils.ts#L72C8-L98C3)
   * @type {Record<keyof AvatarConfig, string[]>}
   */
  const defaultOptions = {
    sex: ["man", "woman"],
    faceColor: ["#F9C9B6", "#AC6651"],
    earSize: ["small", "big"],
    hairColor: ["#000", "#fff", "#77311D", "#FC909F", "#D2EFF3", "#506AF4", "#F48150"],
    hairColor: ["#000", "#fff", "#77311D", "#FC909F", "#D2EFF3", "#506AF4", "#F48150"],
    hairStyle: ["normal", "thick", "mohawk", "womanLong", "womanShort"],
    hatColor: ["#000", "#fff", "#77311D", "#FC909F", "#D2EFF3", "#506AF4", "#F48150"],
    hatStyle: ["beanie", "turban", "none"],
    eyeBrowWoman: ["up", "upWoman"],
    eyeStyle: ["circle", "oval", "smile"],
    glassesStyle: ["round", "square", "none"],
    noseStyle: ["short", "long", "round"],
    mouthStyle: ["laugh", "smile", "peace"],
    shirtStyle: ["hoody", "short", "polo"],
    shirtColor: ["#9287FF", "#6BD9E9", "#FC909F", "#F4D150", "#77311D"],
    bgColor: [
      "#9287FF",
      "#6BD9E9",
      "#FC909F",
      "#F4D150",
      "#E0DDFF",
      "#D2EFF3",
      "#FFEDEF",
      "#FFEBA4",
      "#506AF4",
      "#F48150",
      "#74D153",
    ],
  };

  /**
   * @param {string} current
   * @param {string[]} values
   * @returns {string}
   */
  function toggleValue(current, values) {
    const index = values.findIndex((v) => v === current);
    if (index === -1) return values[0];
    return values[(index + 1) % values.length];
  }

  /**
   * @param {keyof AvatarConfig} field
   * @returns {AvatarConfig}
   */
  function change(field) {
    if (defaultOptions[field] === undefined) throw Error(`default value for ${field} does not exist`);
    return { ...config, [field]: toggleValue(config[field], defaultOptions[field]) };
  }

  return change;
}

/**
 *
 * @typedef Props
 * @property {AvatarConfig} config
 * @property {(config: AvatarConfig) => void} onUpdate
 * @property {string} [playerId]
 * @property {string} [authToken]
 * @property {boolean} [hasCustomImage]
 * @property {(file: File) => void} [onFileSelect]
 * @property {() => void} [onFileRemove]
 *
 * @param {Props} param0
 */
export default function AvatarEditor({ config, onUpdate, playerId, authToken, hasCustomImage = false, onFileSelect, onFileRemove }) {
  const changeConfig = useConfigChanger(config);
  const t = useTranslations("common");
  const fileInputRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  // Track if we're using custom image mode
  const [useCustomImage, setUseCustomImage] = useState(hasCustomImage);
  
  // API base URL for backend requests
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update useCustomImage when prop changes
  useEffect(() => {
    setUseCustomImage(hasCustomImage);
  }, [hasCustomImage]);

  /**
   * @param {keyof AvatarConfig} field
   */
  function onClick(field) {
    return () => onUpdate(changeConfig(field));
  }

  /** @type {Record<keyof AvatarConfig, string>} */
  const toggleButtons = {
    earSize: t("AvatarEditor.earSize"),
    hairStyle: t("AvatarEditor.hairStyle"),
    hairColor: t("AvatarEditor.hairColor"),
    faceColor: t("AvatarEditor.faceColor"),
    bgColor: t("AvatarEditor.bgColor"),
    hatStyle: t("AvatarEditor.hatStyle"),
    mouthStyle: t("AvatarEditor.mouthStyle"),
    noseStyle: t("AvatarEditor.noseStyle"),
    shirtStyle: t("AvatarEditor.shirtStyle"),
    glassesStyle: t("AvatarEditor.glassesStyle"),
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError(t("AvatarEditor.invalidFileType"));
      return;
    }

    setError(null);

    // Deferred mode: parent will upload the image after the player is created
    if (onFileSelect) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setUseCustomImage(true);
      onFileSelect(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsLoading(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${apiUrl}/players/${playerId}/avatar-image`, {
        method: "POST",
        headers: {
          Authorization: authToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      setUseCustomImage(true);
    } catch (err) {
      setError(err.message);
      setPreviewImage(null);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    // Deferred mode: just clear the local selection
    if (onFileRemove) {
      setPreviewImage(null);
      setUseCustomImage(false);
      onFileRemove();
      return;
    }

    if (!playerId || !authToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/players/${playerId}/avatar-image`, {
        method: "DELETE",
        headers: {
          Authorization: authToken,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Delete failed");
      }

      setPreviewImage(null);
      setUseCustomImage(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Image URL for displaying uploaded image
  const imageUrl = useCustomImage && playerId ? `${apiUrl}/players/${playerId}/avatar-image` : null;

  return (
    <div className="flex gap-4">
      <div>
        <div className="avatar placeholder">
          {isClient ? (
            <Suspense
              fallback={
                <div className="skeleton rounded-full w-36 h-36" />
              }
            >
              {useCustomImage && playerId && imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Player"
                  className="rounded-full w-36 h-36 object-cover"
                  onError={() => setUseCustomImage(false)}
                />
              ) : useCustomImage && previewImage ? (
                <img
                  src={previewImage}
                  alt="Player"
                  className="rounded-full w-36 h-36 object-cover"
                />
              ) : (
                <Avatar className="text-neutral-content rounded-full w-36" key={config.sex} {...config} />
              )}
            </Suspense>
          ) : (
            <div className="skeleton rounded-full w-36 h-36" />
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div>
          <p className="label">{t("AvatarEditor.title")}</p>
        </div>
        
        {useCustomImage ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn btn-sm btn-error text-white"
              onClick={handleRemoveImage}
              disabled={isLoading}
            >
              {t("AvatarEditor.removePicture")}
            </button>
            {isLoading && <Loader />}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {Object.entries(toggleButtons).map(([field, label]) => (
                <button
                  className="btn btn-sm min-h-[2.75rem] px-3"
                  type="button"
                  onClick={onClick(field)}
                  key={field}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link text-primary underline decoration-dotted"
              onClick={triggerFileInput}
              disabled={((!playerId || !authToken) && !onFileSelect) || isLoading}
            >
              {t("AvatarEditor.uploadPicture")}
            </button>
            {isLoading && <Loader />}
          </div>
        )}
        
        {error && <p className="text-error text-sm">{error}</p>}
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
