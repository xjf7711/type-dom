import { TypeSvgSvg } from '../../../type-element/type-svg/svg/svg.abstract';
import { TypeHtml } from '../../../type-element/type-html/type-html.abstract';
import { SvgPath } from '../../../element/svg-element/path/path.class';

export class DateSvg extends TypeSvgSvg {
  className: 'DateSvg';
  childNodes: [SvgPath];
  constructor(public parent: TypeHtml) {
    super();
    this.className = 'DateSvg';
    const path = new SvgPath(this);
    path.setData('M825.582656 99.902439V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813s-36.908401 14.929864-36.908401 33.300813v66.601626H548.908401V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813s-36.908401 14.929864-36.908401 33.300813v66.601626H272.012141V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813S198.417344 14.929864 198.417344 33.300813v66.601626C115.165312 103.676531 48.563686 169.445637 48.563686 249.756098v624.390243c0 82.641518 70.320217 149.853659 156.791328 149.853659h613.289972c86.471111 0 156.791328-67.212141 156.791328-149.853659V249.756098c0-80.310461-66.601626-146.079566-149.853658-149.853659zM198.417344 177.937344V244.205962c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.908401-14.929864 36.908401-33.300813V177.604336h202.857453v66.601626c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.908401-14.929864 36.908401-33.300813V177.604336h203.079458v66.601626c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.686396-14.929864 36.686396-33.300813V177.937344c40.238482 3.330081 72.151762 34.244336 72.151761 71.818754v99.902439H126.265583V249.756098c0-37.574417 31.635772-68.488672 72.151761-71.818754zM818.644986 946.298103H205.355014c-43.624065 0-79.089431-32.35729-79.089431-72.151762V416.260163h771.468834v457.886178c0 39.794472-35.465366 72.151762-79.089431 72.151762z',
      'M470.373984 671.566396q43.069051-14.041843 43.124553-55.112846v-46.954146a48.508184 48.508184 0 0 0-27.750678-46.010624A137.865366 137.865366 0 0 0 420.422764 508.836423q-92.96477 0-92.964769 60.551978V627.165312h73.927804v-57.277399q0-10.267751 15.595881-10.26775t15.096369 10.26775v60.551979c0 13.375827-5.550136 20.035989-29.526721 20.035989v38.850948c13.764336 0 16.983415 1.609539 22.200542 4.88412s7.548184 9.43523 7.548184 18.481951v79.200433q0 12.654309-15.096368 12.654309t-15.096369-12.654309V715.96748H325.515447v76.036856q0 64.881084 95.184824 64.881084Q514.775068 856.996423 514.775068 785.732683v-50.78374q0-51.782764-44.401084-63.382547zM626.610298 511.944499a43.069051 43.069051 0 0 1-12.487805 27.417669 39.350461 39.350461 0 0 1-30.636748 14.097344v49.95122h31.746775v250.644119h83.252033V511.944499z');
    this.childNodes = [path];
  }
}
