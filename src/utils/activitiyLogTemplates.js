import { TreeItem, TreeView } from "@material-ui/lab";
import { dividerTimeFormat } from "./common";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// constants
export const stockadjustment = 'stockadjustment'
export const car = 'car'
// util functions
const restrictedKeys = ["updatedAt", "createdAt", "deletedAt", "id", "Id", "userId", "cnicId", "photoId", "companyId", "logoId", "contactId", "categoryId", "brandId", "uomId"]
export const replaceKeyWords = (currentKeyWord, customKeyWord) => {
    return
}

// flat template
export const addFlatTemplate = (activityLog) => [
    <span>
        <span style={{ fontWeight: 600 }}>
            {
                `${activityLog.User.firstName || ''} ${activityLog.User.lastName || ''} `
            }
        </span>
        <span>
            added
        </span>
        <span>
            {
                ` ${activityLog.ActivitySourceType.name || ''}`
            }
        </span>
        <span style={{ fontWeight: 600 }}>
            {
                ` ${activityLog.currentPayload.name || activityLog.currentPayload.internalIdForBusiness || activityLog.currentPayload.registrationNumber || ''} `
            }
        </span>
        <span>
            at
        </span>
        <span style={{ fontWeight: 600 }}>
            {
                ` ${dividerTimeFormat(activityLog.updatedAt)}`
            }
        </span>
    </span>
]

export const deleteFlatTemplate = (activityLog) => [
    <span>
        <span style={{ fontWeight: 600 }}>
            {
                `${activityLog.User.firstName || ''} ${activityLog.User.lastName || ''} `
            }
        </span>
        <span>
            deleted
        </span>
        <span>
            {
                ` ${activityLog.ActivitySourceType.name || ''}`
            }
        </span>
        <span style={{ fontWeight: 600 }}>
            {
                ` ${activityLog.previousPayload.name || activityLog.previousPayload.internalIdForBusiness || ''} `
            }
        </span>
        <span>
            at
        </span>
        <span style={{ fontWeight: 600 }}>
            {
                ` ${dividerTimeFormat(activityLog.updatedAt)}`
            }
        </span>
    </span>
]

export const editFlatTemplate = (activityLog) => [<p>
    <span style={{ fontWeight: 600 }}>
        {
            `${activityLog.User.firstName || ''} ${activityLog.User.lastName || ''} `
        }
    </span>
    <span>
        edited
    </span>
    <span>
        {
            ` ${activityLog.ActivitySourceType &&
                activityLog.ActivitySourceType.name.toLowerCase() === car ?
                'Vehicle Type'
                :
                activityLog.ActivitySourceType.name || ''

            }`
        }
    </span>
    <span style={{ fontWeight: 600 }}>
        {
            ` ${activityLog.currentPayload.name || activityLog.currentPayload.internalIdForBusiness || activityLog.currentPayload.registrationNumber || ''} `
        }
    </span>
    <span>
        at
    </span>
    <span style={{ fontWeight: 600 }}>
        {
            ` ${dividerTimeFormat(activityLog.updatedAt)}`
        }
    </span>
    {/* Line break */}
    {/* {
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            <TreeItem nodeId="1" label="Previous Data">
                {
                    Object.keys(activityLog.previousPayload).map((key, idx) => {
                        if (!restrictedKeys.includes(key))

                            return <TreeItem nodeId={idx} label={`${key} : ${activityLog.previousPayload[key] || '-'}`} />
                    })
                }
            </TreeItem>
            <TreeItem nodeId="11" label="Current Data">
                {
                    Object.keys(activityLog.currentPayload).map((key, idx) => {
                        if (!restrictedKeys.includes(key))

                            return <TreeItem nodeId={idx} label={`${key} : ${activityLog.currentPayload[key] || '-'}`} />
                    })
                }
            </TreeItem>
        </TreeView>
    } */}
</p>]