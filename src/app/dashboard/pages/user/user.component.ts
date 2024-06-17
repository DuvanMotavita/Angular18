import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { User } from '@interfaces/req-response';
import { UsersService } from '@services/users.service';
import { TitleComponent } from '@shared/title/title.component';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, TitleComponent],
  template: ` <app-title [title]="titleLabel()" />
    @if (user()) {
    <section>
      <img [srcset]="user()!.avatar" [alt]="user()!.first_name" />
    </section>
    <div>
      <h3>{{ user()?.first_name }} {{ user()?.last_name }}</h3>
      <p>{{ user()?.email }}</p>
    </div>
    }@else {
    <p>Cargando Informacion</p>
    }`,
})
export default class UserComponent {
  private route = inject(ActivatedRoute);
  private userServices = inject(UsersService);

  // public user = signal<User | undefined>(undefined);

  public user = toSignal(
    this.route.params.pipe(
      switchMap(({ id }) => this.userServices.getUserById(id))
    )
  );

  public titleLabel = computed(() => {
    if (this.user()) {
      return ` Informacion del usuario:  ${this.user()?.first_name}  ${
        this.user()?.last_name
      }`;
    }
    return 'informacion del usuario';
  });

  // constructor() {
  //   this.route.params.subscribe((params) => {
  //     console.log({ params });
  //   });
  // }
}
