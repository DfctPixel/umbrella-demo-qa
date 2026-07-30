# Umbrella FinOps — Exploration Report
> 2026-07-29T13:13:28.694Z

## Dashboard
- ✅ **Dashboard** → `https://dev.umbrellacost.dev/dashboard`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/summary` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list/total` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list/total` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection/anomalies/stats` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/commitment/utilization/i/summary?date=2026-07-01&commitmentType=sp&linkedAccount=&payerAccount=&commitmentServices=EC2InstanceSavingsPlans&commitmentServices=ComputeSavingsPlans` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/commitment/utilization/i/summary?date=2026-07-01&commitmentType=ri&linkedAccount=&payerAccount=&commitmentServices=ec2&commitmentServices=rds&commitmentServices=elasticache&commitmentServices=redshift&commitmentServices=os&commitmentServices=es` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200

## Cost & Usage
- ✅ **Cost & Usage Explorer** → `https://dev.umbrellacost.dev/cost-usage/cost-usage-explorer?chartTableData=%7B%7D&cueFetchCount=0&filteredKeys=%5B%5D&allKeys=%5B%5D&visibleFilters=%5B%5D&changedTableColumnWidth=%5B%5D&isInitialDataKeyFilterLoad=true&isDateRangeError=false&isApplyFiltersButtonDisabled=true&isUsageFilterAlertClosed=false&saveModalIsOpen=false&saveGoalModalOpen=false&changeGoalModalOpen=false&overwriteReportModalIsOpen=false&existingCustomDashboardPanelModalIsOpen=false&newCustomDashboardPanelModalIsOpen=false&saveModalName=%22%22&saveModalUserEmail=%22%22&saveModalDeliveryFreq=3&saveModalDeliveryTime=null&saveModalCustomMailDeliveryFrequency=null&saveModalCustomMailFrequencyStartDate=null&saveModalRelativeDates=30&errorText=%22At+least+one+service+filter+must+be+selected%22&selectedPageSize=15&periodType=%22relativeDates%22&saveModalKeepDates=false&dataStartDate=null&dataEndDate=null&forceRefresh=false&nextDrillDown=null&k8sUsageSelected=false&isAreaChart=false&isDisplayTable=false&isPieChart=false&isLineChart=false&redirectParams=%7B%7D&diveDate=null&filterBarGroupBy=%22service%22&currentGroupBy=%22service%22&filterBarGroupBySecondary=%22usagedate%22&dataKeyToWhereParamsMap=%7B%7D&fieldToFilterdValuesMap=%7B%22chargetype%22%3A%5B%22Tax%22%5D%2C%22cloudcosttype%22%3A%5B%22cost%22%2C%22discount%22%5D%7D&excludedFiltersStatusMap=%7B%22chargetype%22%3A1%7D&likeFiltersStatus=%7B%7D&filtersConfig=%7B%7D&displayMetricTypes=%22Cost%22&SelectedUsageType=%22Usage%22&carbonEmissionsUsage=null&isTimezonePST=false&isUsageChecked=false&isCarbonEmissionsChecked=false&isRateUsageBased=false&isRateChecked=false&currPeriodGranLevel=%22day%22&selectedGranLevel=%22day%22&dateBasis=%22usagedate%22&startDate=%222026-07-01%22&endDate=%222026-07-31%22&currCostType=%5B%22cost%22%2C%22discount%22%5D&selectedGoal=null&isFiltersOpen=false&isEventsOpen=false&isStateFromReport=false&isTrendLine=false&isCumulative=false&isTableTrendRow=false&isTableOnlyTrendRow=false&isShowOthers=true&isNetAmortize=false&isShowAmortizeCost=true&isNetUnblended=false&isPublicCost=false&isDistributed=false&isListUnitPrice=false&isSavingsCost=false&accountKey=111111177&cloudAccountTypeId=0&divisionId=0&divisionName=%22932213950603%22&isPpApplied=false&wasteCostAllocationChecked=false&viewId=null&panelId=null&selectedKpiId=null&selectedMetricId=null&kpiMetricUnit=%22%22&kpiShowPercent=false`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/events?startDate=2026-07-01&endDate=2026-07-31` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/cue-views` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/goals` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/virtual-tags/virtual-tags` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/channels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all-org` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/invoices/caui` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
- ✅ **Reports** → `https://dev.umbrellacost.dev/cost-usage/reports`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all-org` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/channels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
- ✅ **Dashboards** → `https://dev.umbrellacost.dev/cost-usage/dashboards/tab/all`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard-settings` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard-labels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/roles` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
- ✅ **Panels** → `https://dev.umbrellacost.dev/cost-usage/panels`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Assets** → `https://dev.umbrellacost.dev/cost-usage/assets`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all-org` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/virtual-tags/virtual-tags` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
- ✅ **Resource Explorer** → `https://dev.umbrellacost.dev/cost-usage/resource-explorer`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **K8s Preferences** → `https://dev.umbrellacost.dev/cost-usage/k8s-preferences`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200

## Unit Economics
- ✅ **Unit Economics** → `https://dev.umbrellacost.dev/unit-economics`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200

## Recommendations
- ✅ **Waste Detector** → `https://dev.umbrellacost.dev/recommendations/explorer`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/summary` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/groupByOptions` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list/columns` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/views` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/workflow/available-workflow-channels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicRanges` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/same-company-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/summary` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list/columns` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
- ✅ **Reports** → `https://dev.umbrellacost.dev/recommendations/reports`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/same-company-users` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicFilter/service?invoiceMode=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicFilter/type_id?invoiceMode=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/recommendations/report` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/channels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
- ✅ **Preferences** → `https://dev.umbrellacost.dev/recommendations/preferences`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/preferences` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/same-company-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200

## Cost Allocation
- ✅ **Business Mapping** → `https://dev.umbrellacost.dev/cost-allocation/business-mapping`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
- ✅ **Tag Governance** → `https://dev.umbrellacost.dev/cost-allocation/tag-governance`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-costs/distinct-tags/governance` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
- ✅ **Tag Groups** → `https://dev.umbrellacost.dev/cost-allocation/tag-groups`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Enrichment Tags** → `https://dev.umbrellacost.dev/cost-allocation/enrichment-tags`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
- ✅ **Filter Group** → `https://dev.umbrellacost.dev/cost-allocation/filter-group`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/categories` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/virtual-tags/virtual-tags` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Views** → `https://dev.umbrellacost.dev/cost-allocation/views`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/views` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200

## Commitment
- ✅ **Dashboard** → `https://dev.umbrellacost.dev/commitment/dashboard`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/commitment/dashboard?periodGranLevel=month&startDate=2026-02-01&endDate=2026-07-31&filters[service]=ec2` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **My Commitments** → `https://dev.umbrellacost.dev/commitment/my-commitments`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v2/commitment/riUtilizationDetails?start=2025-07-29&end=2026-07-29` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200

## Monitoring
- ✅ **Anomaly Detection** → `https://dev.umbrellacost.dev/monitoring/anomaly-detection`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection?startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false&isPageCount=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection/rules` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection?alerted=true&startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection?startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=NaN` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Budget** → `https://dev.umbrellacost.dev/monitoring/budget?search=`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/budgets/v2/i/?only_metadata=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/subviewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Alerts** → `https://dev.umbrellacost.dev/monitoring/alerts`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/alerts` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200

## Partner
- ✅ **Billing Rules** → `https://dev.umbrellacost.dev/partner/billing-rules`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/msp/billing-rules/v2/templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/msp/billing-rules/v2` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=NaN` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=NaN` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Billing Status** → `https://dev.umbrellacost.dev/partner/billing-status`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **Billing Summary** → `https://dev.umbrellacost.dev/partner/billing-summary`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/customers/aws/costs/?startDate=2026-06-01&endDate=2026-06-30` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
- ✅ **Billing History** → `https://dev.umbrellacost.dev/partner/billing-history`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
- ✅ **Credits** → `https://dev.umbrellacost.dev/partner/credits`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/customers/credit/alerts` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/customers/aws/credit` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=NaN` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
- ✅ **Manage Customers** → `https://dev.umbrellacost.dev/partner/manage-customers`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **Preferences** → `https://dev.umbrellacost.dev/partner/preferences`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **Reports** → `https://dev.umbrellacost.dev/partner/reports`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200

## AIOps
- ✅ **Insights** → `https://dev.umbrellacost.dev/aiops/insights`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **Executive View** → `https://dev.umbrellacost.dev/aiops/executive-view`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **AI Cost & Usage Explorer** → `https://dev.umbrellacost.dev/aiops/ai-cost-usage-explorer`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Users & Teams** → `https://dev.umbrellacost.dev/aiops/users-teams`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **Model Summary** → `https://dev.umbrellacost.dev/aiops/model-summary`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **Models Lifecycle** → `https://dev.umbrellacost.dev/aiops/models-lifecycle`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **AI Integrations** → `https://dev.umbrellacost.dev/aiops/ai-integrations`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200
- ✅ **Anomalies** → `https://dev.umbrellacost.dev/aiops/anomalies`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
- ✅ **Alerts** → `https://dev.umbrellacost.dev/aiops/alerts`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200

## CostGPT
- ✅ **CostGPT** → `https://dev.umbrellacost.dev/cost-gpt`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/gpt/user-data` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/gpt/available-data` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200

## Pricing
- ✅ **Pricing** → `https://dev.umbrellacost.dev/pricing`
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` → 200
  - `POST` `https://api.dev.umbrellacost.dev/api/v1/client-metrics` → 204
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/users/notifications` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` → 200
  - `GET` `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` → 200

## Unique API Endpoints Discovered

| Method | Endpoint | Status |
|--------|----------|--------|
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection?alerted=true&startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection?startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection?startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false&isPageCount=true` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection/anomalies/stats` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/anomaly-detection/rules` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/budgets/v2/i/?only_metadata=true` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/channels` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/client-metrics` | 204 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/commitment/dashboard?periodGranLevel=month&startDate=2026-02-01&endDate=2026-07-31&filters[service]=ec2` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/commitment/utilization/i/summary?date=2026-07-01&commitmentType=ri&linkedAccount=&payerAccount=&commitmentServices=ec2&commitmentServices=rds&commitmentServices=elasticache&commitmentServices=redshift&commitmentServices=os&commitmentServices=es` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/commitment/utilization/i/summary?date=2026-07-01&commitmentType=sp&linkedAccount=&payerAccount=&commitmentServices=EC2InstanceSavingsPlans&commitmentServices=ComputeSavingsPlans` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/divisions/customers/aws/costs/?startDate=2026-06-01&endDate=2026-06-30` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/divisions/customers/aws/credit` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/divisions/customers/credit/alerts` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=NaN` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/divisions/i/?includeEmpty=true` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/gpt/available-data` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/gpt/user-data` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/invoices/caui` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/invoices/cue-views` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/subviewscustomtags/values` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/invoices/dimensions-config/dimensions/workloadtype/values` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/invoices/service-costs/distinct-tags/governance` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/invoices/service-names/distinct` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/msp/billing-rules/v2` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/msp/billing-rules/v2/templates` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/recommendations/report` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicFilter/service?invoiceMode=true` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicFilter/type_id?invoiceMode=true` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/dynamicRanges` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/groupByOptions` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/heatmap/summary` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list/columns` | 200 |
| `POST` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/list/total` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/recommendationsNew/views` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/alerts` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/business-mapping/viewpoints` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/categories` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard-labels` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard-settings` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboard/default` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/dashboards-templates` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/custom-dashboard/panels` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/goals` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/reports/all-org` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/views` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/usage/virtual-tags/virtual-tags` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/events?startDate=2026-07-01&endDate=2026-07-31` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/notifications` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/on-boarding/v2/byod/vendors` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/plain-sub-users` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/preferences` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/roles` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/same-company-users` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/users/user-settings/notifications` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v1/workflow/available-workflow-channels` | 200 |
| `GET` | `https://api.dev.umbrellacost.dev/api/v2/commitment/riUtilizationDetails?start=2025-07-29&end=2026-07-29` | 200 |