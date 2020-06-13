import {ElementRef} from '@angular/core'

declare var M

export interface MaterialInit {
  open?(): void
  close?(): void
  destroy?(): void
}

export interface MaterialDatepicker extends MaterialInit {
  date?: Date
}

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message})
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement)
  }

  static updateTextInputs() {
    M.updateTextFields()
  }

  static initModal(ref: ElementRef): MaterialInit {
    return M.Modal.init(ref.nativeElement)
  }

  static initTooltip(ref: ElementRef): MaterialInit {
    return M.Tooltip.init(ref.nativeElement)
  }

  static initTapTarget(ref: ElementRef): MaterialInit {
    return M.TapTarget.init(ref.nativeElement)
  }

  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    })
  }
}
