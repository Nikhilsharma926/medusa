import { INotificationModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "../../../core/utils/dist"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

export default async function notificationsHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const notificationService: INotificationModuleService = container.resolve(
    ModuleRegistrationName.NOTIFICATION
  )

  await notificationService.handleEvent(event)
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"], // this should be the wildcard *
  context: {
    subscriberId: "nofications-handler",
  },
}
