
    document.getElementById('formPagoBasica').addEventListener('submit', function (e) {
      e.preventDefault();
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalPagoBasica'));
      modal.hide();

      // Simular procesamiento
      Swal.fire({
        title: 'Procesando pago...',
        text: 'Espere un momento',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
        timer: 2000
      }).then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: 'Tu membresía ha sido activada. ¡Disfrútala al máximo!',
        });
      });
    });
 
    document.getElementById('formPagoPremium').addEventListener('submit', function (e) {
      e.preventDefault();
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalPagoPremium'));
      modal.hide();

      // Simular procesamiento
      Swal.fire({
        title: 'Procesando pago...',
        text: 'Espere un momento',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
        timer: 2000
      }).then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: 'Tu membresía ha sido activada. ¡Disfrútala al máximo!',
        });
      });
    });


  
    document.getElementById('formPagoVip').addEventListener('submit', function (e) {
      e.preventDefault();
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalPagoVip'));
      modal.hide();

      // Simular procesamiento
      Swal.fire({
        title: 'Procesando pago...',
        text: 'Espere un momento',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
        timer: 2000
      }).then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: 'Tu membresía ha sido activada. ¡Disfrútala al máximo!',
        });
      });
    });
 