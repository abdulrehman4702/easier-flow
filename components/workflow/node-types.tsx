import { ApiNode } from "@/components/workflow/api-node"
import { DataMapperNode } from "@/components/workflow/data-mapper-node"
import { TransformerNode } from "@/components/workflow/transformer-node"
import { TriggerNode } from "@/components/workflow/trigger-node"
import { FilterNode } from "@/components/workflow/filter-node"

export const NodeTypes = {
  apiNode: ApiNode,
  dataMapperNode: DataMapperNode,
  transformerNode: TransformerNode,
  triggerNode: TriggerNode,
  filterNode: FilterNode,
}

