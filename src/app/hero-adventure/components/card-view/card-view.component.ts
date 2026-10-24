import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardDefinition, CardInstance } from '../../models/card.model';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss'],
})
export class CardViewComponent {
  @Input() card!: CardDefinition;
  @Input() instance: CardInstance | null = null;
  @Input() resolvedText = '';
  @Input() selected = false;
  @Input() disabled = false;
  @Input() compact = false;
  @Output() choose = new EventEmitter<void>();

  onChoose(): void {
    // Mesmo quando a carta está visualmente indisponível, propagamos o clique.
    // A tela de batalha consegue então explicar *por que* ela não pode ser usada
    // (ex.: Energia insuficiente), evitando a sensação de botão travado.
    this.choose.emit();
  }
}
