import { ActionSheet, ActionSheetOpts, ActionSheetLifeCycleArgs, } from '../../component/action-sheet/index';
import istype from '../../util/istype';
import eventHub from '../../service/event-hub';
import { SketchSchema } from '../../core/sketch';

import './index.less';

interface NavBtn {
  name: string;
  feedback(): Promise<any>;
  // useProgressBar?: boolean | false;
  receiveEventKey?: string | null;
}

export interface PanelOpts {
  navList: NavBtn[];
  zIndex: number;
  mount: HTMLElement;
}

export class Panel {
  private _actionSheet: ActionSheet = null;
  private _opts: PanelOpts = null;
  private _hasRendered: boolean = false;

  constructor(opts: PanelOpts) {
    this._opts = opts;
    const that = this;
    const { zIndex, mount, } = opts;
    const actionSheetOpts: ActionSheetOpts = {
      height: 120,
      mount,
      zIndex,
      afterRender(args: ActionSheetLifeCycleArgs) {
        const { contentMount, } = args;
        that._render(contentMount);
      }
    }
    const actionSheet = new ActionSheet(actionSheetOpts);
    this._actionSheet = actionSheet;
  }

  show() {
    this._actionSheet.show();
  }

  hide() {
    this._actionSheet.hide();
  }

  private _render(mount: HTMLElement) {
    if (this._hasRendered === true) {
      return;
    }
    const opts: PanelOpts = this._opts;
    const { navList, } = opts;
    const html = `
      <div class="pictool-module-panel">
        <div class="pictool-panel-header">
          <div class="pictool-panel-btn-close"></div>
          <div class="pictool-panel-btn-confirm"></div>
        </div>
        <div class="pictool-panel-navlist">
        ${istype.array(navList) && navList.map(function(nav: NavBtn, idx) {
          return ` 
          <div class="pictool-panel-nav-btn panelnav-icon"
            data-panel-nav-idx="${idx}"
          >
            <span>${nav.name}</span>
          </div>
          `;
        }).join('')}
        </div>
      </div>
    `;
    mount.innerHTML = html;
    this._registerEvent(mount);
    this._hasRendered = true;
  }

  private _registerEvent(mount: HTMLElement) {
    if (this._hasRendered === true) {
      return;
    }
    const that = this;
    const opts: PanelOpts = this._opts;
    const { navList, } = opts;
    const navElemList = mount.querySelectorAll('[data-panel-nav-idx]');
    const btnClose = mount.querySelector('div.pictool-panel-btn-close');
    const btnConfirm = mount.querySelector('div.pictool-panel-btn-confirm');

    btnClose.addEventListener('click', function() {
      that.hide();
    });

    btnConfirm.addEventListener('click', function() {
      that.hide();
    });

    if (istype.nodeList(navElemList) === true) {
      navElemList.forEach(function(navElem) {
        navElem.addEventListener('click', function(event) {
          const elem = this;
          const idx = elem.getAttribute('data-panel-nav-idx') * 1;
          const navConf = navList[idx];
          const primise = navConf.feedback();
          // TODO
          console.log(idx);
          if (istype.promise(primise)) {
            primise.then(function(rs) {
              // console.log(rs);
              if (rs) {
                eventHub.trigger('GlobalModule.Sketch.renderImage', rs)
              }
            }).catch((err) => {
              console.log(err);
            })
          }
          
        });
      });
    }
    
  }

}
