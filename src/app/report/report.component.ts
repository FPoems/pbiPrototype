import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import * as pbi from 'powerbi-client';
import { Page } from 'page';
import { Report } from 'report';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, AfterViewInit {
  @Input() reportId: string;
  @ViewChild('report') reportEl: ElementRef;

  private pbiContainerElement: HTMLElement;

  isErrored = false;
  isLoading = true;
  powerbi;
  localReport;
  filters;

  constructor() {
    this.pbiContainerElement = <HTMLElement>(
      document.getElementById('pbi-container')
    );
    this.powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );


  }

  ngAfterViewInit(): void {
    this.loadReport(this.reportId);
    this.localReport = this.powerbi.get(this.reportEl.nativeElement);
  }

  ngOnInit(): void {}

  myLogGet() {
    this.powerbi
      .get(this.reportEl.nativeElement)
      .getFilters()
      .then((filters) => {
        console.log('[1] My log filters | Filters : ', filters);
      });


    this.getFilters();
    this.getSlicer();
    this.getVisualFilters();
  }

  getFilters() {
    this.localReport
      .getPages()
      .then(function (pages) {
        // Retrieve active page.
        var activePage = pages.filter(function (page) {
          return page.isActive;
        })[0];

        activePage
          .getFilters()
          .then(function (filters) {
            console.log('[2] actionTrigger | Filters : ', filters);
            // TODO

            filters.forEach(function (filter) {
              console.log(
                'e.g.\n [Schema: ',
                filter.$schema,
                ']\n [Operator: ',
                filter.operator,
                ']\n [target(column,table): (',
                filter.target.column,',',
                filter.target.table,
                ')]\n',
                ' [Values',
                filter.values,']'
              );
            });
          })
          .catch(function (errors) {
            console.log(errors);
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  }

  getSlicer() {
    //SLICER [It's Working !]
    this.localReport
      .getPages()
      .then(function (pages) {
        // Retrieve active page.
        var activePage = pages.filter(function (page) {
          return page.isActive;
        })[0];

        activePage
          .getVisuals()
          .then(function (visuals) {
            // Retrieve the target visual.
            var slicer = visuals.filter(function (visual) {
              return (
                visual.type == 'slicer' && visual.name == '4d55baaa5eddde4cdf90'
              );
            })[0];

            // Get the slicer state which contains the slicer filter.
            slicer
              .getSlicerState()
              .then(function (state) {
                console.log('[3] Slicer State : ', state);
              })
              .catch(function (errors) {
                console.log(errors);
              });
          })
          .catch(function (errors) {
            console.log(errors);
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  }

  getVisualFilters() {
    //VISUAL FILTER
    this.localReport
      .getPages()
      .then(function (pages) {
        // Retrieve active page.
        var activePage = pages.filter(function (page) {
          return page.isActive;
        })[0];

        activePage
          .getVisuals()
          .then(function (visuals) {
            // Retrieve the target visual.
            var visual = visuals.filter(function (visual) {
              return visual.name == 'VisualContainer4';
            })[0];
            visual
              .getFilters()
              .then(function (filters) {
                console.log('[4] Visual Container', filters);
              })
              .catch(function (errors) {
                console.log(errors);
              });
          })
          .catch(function (errors) {
            console.log(errors);
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  }

  myLogSet() {
    let report = this.powerbi.get(this.reportEl.nativeElement);

    this.setSlicer();
    this.setPageFilter();
    this.setVisualFilters();
  }

  setSlicer() {
    const filter = {
      $schema: 'http://powerbi.com/product/schema#advanced',
      target: {
        table: 'Date',
        column: 'Date',
      },
      filterType: 0,
      logicalOperator: 'And',
      conditions: [
        {
          operator: 'GreaterThanOrEqual',
          value: '2014-10-12T21:00:00.000Z',
        },
        {
          operator: 'LessThan',
          value: '2014-11-28T22:00:00.000Z',
        },
      ],
    };

    // Retrieve the page collection and get the visuals for the first page.
    this.localReport
      .getPages()
      .then(function (pages) {
        // Retrieve active page.
        var activePage = pages.filter(function (page) {
          return page.isActive;
        })[0];
        activePage
          .getVisuals()
          .then(function (visuals) {
            // Retrieve the target visual.
            var slicer = visuals.filter(function (visual) {
              return (
                visual.type == 'slicer' && visual.name == '4d55baaa5eddde4cdf90'
              );
            })[0];
            // Set the slicer state which contains the slicer filters.
            slicer
              .setSlicerState({ filters: [filter] })
              .then(function () {
                console.log('Date slicer was set.');
              })
              .catch(function (errors) {
                console.log(errors);
              });
          })
          .catch(function (errors) {
            console.log(errors);
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  }

  setPageFilter() {
    // Build the filter you want to use. For more information, see Constructing
    // Filters in https://github.com/Microsoft/PowerBI-JavaScript/wiki/Filters.
    const filter = {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
        table: 'Geo',
        column: 'Region',
      },
      operator: 'In',
      values: ['West'],
    };

    // Retrieve the page collection and then set the filters for the first page.
    // Pay attention that setFilters receives an array.
    this.localReport
      .getPages()
      .then(function (pages) {
        // Retrieve active page.
        var activePage = pages.filter(function (page) {
          return page.isActive;
        })[0];

        activePage
          .setFilters([filter])
          .then(function () {
            console.log('Page filter was set. [e.g.WEST]');
          })
          .catch(function (errors) {
            console.log(errors);
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  }

  setVisualFilters() {
    // Build the filter you want to use. For more information, See Constructing
    // Filters in https://github.com/Microsoft/PowerBI-JavaScript/wiki/Filters.
    const filter = {
      $schema: 'http://powerbi.com/product/schema#advanced',
      target: {
        table: 'SalesFact',
        measure: 'Total Category Volume',
      },
      filterType: 0,
      logicalOperator: 'And',
      conditions: [
        {
          operator: 'LessThan',
          value: 69,
        },
      ],
    };
    // Retrieve the page collection and get the visuals for the first page.
    this.localReport
      .getPages()
      .then(function (pages) {
        // Retrieve active page.
        var activePage = pages.filter(function (page) {
          return page.isActive;
        })[0];

        activePage
          .getVisuals()
          .then(function (visuals) {
            // Retrieve the target visual.
            var visual = visuals.filter(function (visual) {
              return visual.name == 'VisualContainer4';
            })[0];

            // Set the filter for the visual.
            // Pay attention that setFilters receives an array.
            visual
              .setFilters([filter])
              .then(function () {
                console.log('Filter was set for "Category Breakdown" table.');
              })
              .catch(function (errors) {
                console.log(errors);
              });
          })
          .catch(function (errors) {
            console.log(errors);
          });
      })
      .catch(function (errors) {
        console.log(errors);
      });
  }

  runPowerBiSpider() {

    // report id
    var reportId = this.localReport.getId();
    console.log('[1/3] Report id: ' + reportId);
    // page name and display name of each page and display the value.
    this.localReport
      .getPages()
      .then(function (pages) {
        var log = '[2/3] Report pages:';
        pages.forEach(function (page) {
          log += '\n' + page.name + ' - ' + page.displayName;
        });
        console.log(log);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Retrieve the page collection and get the visuals for the first page.
    this.localReport.getPages().then(function (pages) {
      // Retrieve active page.
      var activePages = pages.filter(function (page) {
        return page.isActive;
      });

      activePages.forEach(function (page) {
        page
          .getVisuals()
          .then(function (visuals) {
            console.log(
              'Page Name/displayName :',
              page.name,
              '/',
              page.displayName,
              visuals.map(function (visual) {
                return {
                  name: visual.name,
                  type: visual.type,
                  title: visual.title,
                  layout: visual.layout,
                };
              })
            );
          })
          .catch(function (errors) {
            console.log(errors);
          });
      });
    });
  }

  private loadReport(reportId: string) {
    console.log('loading ... ', reportId);

    const embedConfig = {
      type: 'report',
      id: reportId,
      embedUrl:
        'https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjpmYWxzZX19',
      tokenType: pbi.models.TokenType.Embed,
      accessToken:
        'H4sIAAAAAAAEACWWxQ70CA6E3-W_ZqQwjTSHMEOHk1s4HWZa7btvr-ZuyXLZ_qr-88dOn35Kiz9__0EM7UwGUYn2gFgvbD6fMhvqaFBFavfLIKu-WWyzu0RWDaO7MgEzNl-LkSbabDi8UGGa8tZX_mR7Al5GxZlNyEw_lNrCcGVgTOaRhDLe1cY1OgEOnu6ivUpQ2SEVdruPMTwouoneWAN2eEuLFit8zwBIQAnMCwo9bne6w36tg497weoYKKLfaUdFg4sqJILSrLcFtU-wocehcsmGdXtp0NMZM98RQTcKthxYAIAqxCx6Z4E2-HwmXTHtlUBX_OoP4cz1jII-8oUHgD4ilxpYSYVPklLq14sMB5m8mNHe4yQiPUIVDH0LWsBLE5FIRexozjfd5dvwbUVjK1hICKYNVolfY1EcIBp55FtbHrOThu28SAWjgcpbTfyQTUvepLBk2dGztRm23DZVAMjTSyrrMmywXsVrhPmW7Gt4Cost8CwZkTGWbkVTCcdbv9A-t61uNDncxxfekP3lA47LRpBIwhZRTgS3tnKaUKD7uTjlFK7PcIffWN1kWbqbIp3zFjRquHgp1D0nlsPzGlkq5SzVNAzj5Fzme1KAnO9q99iLY-i3xT_oxac-qwNsTC0Jb-kBdzk6QXxbS82D7ex09D5U1eoLWROoHBEXGRT55-L7tBSvS7DFEUux5GNhjMxF0L6TgJSnGdLQN715RUhvvt0GnDffjIto3TibCYztYeNNaX_ApbDvsnXs8ozJ-8PYzoKbxl3j0-9i8KOyCpY5vM7sc2I8SxDKnVhmLLcbkjrDUWoAWIsHuDRPJxn9fod3v9WV65BP-1kPRhFngXvkRgxn1bHLrTGipm233vJnKlObs-ZAHJwgxKOcE9uRJxIQSzom6VDZ7mQKjbVApbDs9pzhd4AEn2WlZF0Qv5tZIAA4YRxV7Thh3_djys_K5rFRSwUeNLjEEL2FBZB23xTBEF7UwdHJsbp6C9KGGtVZTkJQo7pH0s8M2d6hoFbcdMNC_kGLtZ-xrcGooJcXr-uijmw7XuxlQ6ssxbXYgBNU9xv7BKNUXW18HqpxA1vE7Jj6bPiU3Uty4ImXW2_moQVtxGcvMhnCtb72BWt85nQnK2n0NzEOjQzmnF9fDQvHkKedKOkSCRiqhnlE4e0HH9hfD1YpKADEC6I4aFxyR8rA__8sKkS8iy8uZJcHTe8rUq1iZDCDn-cw1jCP6c26WjI6nfnD_Xa24AqrOZzin8lFkMfVTswRJLnuV2tVHF7otaxnAUYZoR_eW0Q0wGkQr9zOa3aKQ2GgHj3AGqfzezNEWfBOln4PlxjuDx0Vcd4LM6TzdXlSG16NydRKjR8nHVhI8DRmN7mT4z1q3Y7L18dIhgE0odjZeeykak0UxzAVvr1ZAoQ_63lo6Ufa4uKJhGl2i8OQm5Pau2uI5Te-pi8eTtnOavj1u8_WIHgp6IMqEzNeHFtIrvygyaFGdPcLkYuzp0FqaQeWbutRouGym0RW0WZHwuZ7J81xw7NAD4LCKOxiLL196-iue3WAWJJZ8KHWKMobIMcZ-K6B3qJtSXHJoV3Cjgig7OVfg1PvlZ5wK5xrk8R_OwzzXNbIIkUln8p80ZRDh0VQlVYH_C2lc55QkpDyhmijj38ybPRcU_itCAN7SXv90YjduWQtRVnkDml2avp2ro3fgulxhWVmto7ph2WTa_vmL-0cPdJKR0dtvO52li562nKhb0SakJqpuS5qcJk4EfFNfUEJ2J-k_FzGOINBlWO-pFmUju5T6CiRHQ5zBvDwgBGOylwm4Mh_STybfIuJo6YifZ-XROUcsnij7N3eYTlj7kp8sGyCyutOd2nIkBLeYw8yP5E5cUmcQ9I-S6JFEd1-hTUP0Tb1Ravree8uIBCE-Pz8gH3N2dw3OFWPYUPQNzVnNGU7YNzk2QdyZ8xxpgaAuYfHPnS6iJtPuimlzVqR8OvOGQ8kpXLtTfjA9rzxFpBDoFhlPt-aFDNnz-eqfbLyi1efpB3E1XYaXgvaWtJFgaZKxIo1vzI96Vol4-kJ9OSi0ADOcfl1wxyJ6Ccfvhfmtkhpfj2Nj7igkNogCJvW7fhNmtmfNbFXu6eAFHfqR9PZo271WQkJtXrhzfCBFEBz0cs18L7Sco6gJSK3k-9AjJoGaqA-w1hlIflavuZNFN4SaYidnLixLRnrj1IXoDl99XTCXBXp1pn4Fj5kILblK2lfaqYn3HCAANJ0I3SE2VucbQPV2Ucf9XNkOnZ7TF2bw7kf92r9zz9__vrDrc-8T1r5_GKKbVqlv6icc7rrXWHZDC20ybilsygdALEWg8nhKSVhhF9xRs4UiErN0TADLK8qETg_FIfnG2DZLmdXBvre1OMGDvwSyZs9i0hgzsA0bVGZNCLE_NCaYFxYtcppnMP2Ia4r9gNRaHsb58Ls4Y8hQgKTD4K9cCC5k2aIm6fMvA89YnCdHUe6EAs85PVcsSDbmdsEX7U-GpwVBB-7l3T3l-hDiVxqhErvbfeycMSpvpeF9D-wbjqfXAJlAlYGmDq6fvRVxSaecxrWJnphqsovhUh-0UuuSo5cl2qw98NvpOTmKuqdlLTODfCdcndn2VKfNg8HGYTdHz7V2lBavawiO9y0IGP-lfmZm3JVgp_KtdpPlNBfSiWvHT0lSYcK_b9V7rce0_1Yy1_Z4iH0ULCUhbJbdNZIFOgyD0EYPvFk7PeQG832e-qbQn2M21wWReu_UbLjoNWiKDBvQsMuTuqnfdSOAc8eafQaKQT7wj2gbw0tjmUPFZiy8C_IuL0d1v0EcrSZd9UonmxbicIAKqdNi7zWBdasLRagnOcs7n6w-AtXWLg9RHS74S1FHyf6Ro9iE4362MqVQmFyEro_q6GahOXr5x2CW2q5Ho1Nq1Ywr36PIk1BoomFXn3AKGZZtNi1NcmDb8nlsxVFkFTpxeworjNwZmFMHBcGVGV9s0P7Pki00tjvMaUPT3cnziTquxP0nXqr3RGbrHFKoplYunemVUfZLpyYDy6yrl4_mf_7P8f0kBeaCwAA',
    };

    this.isLoading = false;
    this.isErrored = false;
    this.localReport = this.powerbi.embed(
      this.reportEl.nativeElement,
      embedConfig
    );
  }
}
