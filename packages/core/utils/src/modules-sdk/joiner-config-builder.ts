import { ModuleJoinerConfig } from "@medusajs/types"
import {
  camelToSnakeCase,
  deduplicate,
  getCallerFilePath,
  MapToConfig,
  pluralize,
  upperCaseFirst,
} from "../common"
import { join } from "path"
import { readdirSync, statSync } from "fs"

/**
 * Define joiner config for a module based on the models (object representation or entities) present in the models directory. This action will be sync until
 * we move to at least es2022 to have access to top-leve await
 * @param moduleName
 * @param entityQueryingConfig
 * @param linkableKeys
 * @param primaryKeys
 */
export function defineJoinerConfig(
  moduleName: string,
  {
    entityQueryingConfig,
    linkableKeys,
    primaryKeys,
  }: {
    entityQueryingConfig?: { name: string }[]
    linkableKeys?: Record<string, string>
    primaryKeys?: string[]
  } = {}
): Omit<
  ModuleJoinerConfig,
  "serviceName" | "primaryKeys" | "linkableKeys" | "alias"
> &
  Required<
    Pick<
      ModuleJoinerConfig,
      "serviceName" | "primaryKeys" | "linkableKeys" | "alias"
    >
  > {
  let basePath = getCallerFilePath()
  basePath = basePath.includes("dist")
    ? basePath.split("dist")[0] + "dist"
    : basePath.split("src")[0] + "src"
  basePath = join(basePath, "models")

  const models = deduplicate(
    [...(entityQueryingConfig ?? loadModels(basePath))].flatMap((v) => v!.name)
  ).map((name) => ({ name }))

  return {
    serviceName: moduleName,
    primaryKeys: primaryKeys ?? ["id"],
    linkableKeys:
      linkableKeys ??
      models.reduce((acc, entity) => {
        acc[`${camelToSnakeCase(entity.name).toLowerCase()}_id`] = entity.name
        return acc
      }, {} as Record<string, string>),
    alias: models.map((entity, i) => ({
      name: [
        `${camelToSnakeCase(entity.name).toLowerCase()}`,
        `${pluralize(camelToSnakeCase(entity.name).toLowerCase())}`,
      ],
      args: {
        entity: entity.name,
        methodSuffix: pluralize(upperCaseFirst(entity.name)),
      },
    })),
  }
}

/**
 * Build entities name to linkable keys map
 * @param linkableKeys
 */
export function buildEntitiesNameToLinkableKeysMap(
  linkableKeys: Record<string, string>
): MapToConfig {
  const entityLinkableKeysMap: MapToConfig = {}
  Object.entries(linkableKeys).forEach(([key, value]) => {
    entityLinkableKeysMap[value] ??= []
    entityLinkableKeysMap[value].push({
      mapTo: key,
      valueFrom: key.split("_").pop()!,
    })
  })

  return entityLinkableKeysMap
}

function loadModels(basePath: string) {
  const excludedExtensions = [".ts.map", ".js.map", ".d.ts"]

  const modelsFiles = readdirSync(basePath)

  return modelsFiles
    .flatMap((file) => {
      if (
        file.startsWith("index.") ||
        excludedExtensions.some((ext) => file.endsWith(ext))
      ) {
        return
      }

      const filePath = join(basePath, file)
      const stats = statSync(filePath)

      if (stats.isFile()) {
        const required = require(filePath)
        return Object.values(required).filter(
          (resource) => typeof resource === "function" && !!resource.name
        )
      }

      return
    })
    .filter(Boolean) as { name: string }[]
}
